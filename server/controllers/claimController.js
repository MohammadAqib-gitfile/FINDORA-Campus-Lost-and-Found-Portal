const Claim = require('../models/Claim');
const Item = require('../models/Item');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Submit a new claim on an item
async function submitClaim(req, res, next) {
  try {
    const { itemId, proofDescription, contactPhone, verificationAnswer } = req.body;

    if (!itemId || !proofDescription) {
      return res.status(400).json({
        success: false,
        message: 'Item ID and detailed proof of ownership description are required.'
      });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    if (item.status === 'resolved' || item.status === 'claimed') {
      return res.status(400).json({
        success: false,
        message: 'This item has already been claimed or resolved.'
      });
    }

    // Check if user already submitted a pending claim on this item
    const existing = await Claim.findOne({
      itemId: itemId.toString(),
      claimantId: req.user.id,
      status: 'pending'
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You already have an active pending claim on this item.'
      });
    }

    let proofImageUrl = '';
    if (req.file) {
      proofImageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.proofImageUrl) {
      proofImageUrl = req.body.proofImageUrl;
    }

    const claim = await Claim.create({
      itemId: item._id.toString(),
      itemTitle: item.title,
      claimantId: req.user.id,
      claimantName: req.user.name,
      claimantEmail: req.user.email,
      contactPhone: contactPhone || '',
      proofDescription: proofDescription.trim(),
      proofImageUrl,
      verificationAnswer: verificationAnswer || '',
      status: 'pending'
    });

    // Notify item reporter if registered
    if (item.reportedBy && item.reportedBy !== 'guest') {
      await Notification.create({
        userId: item.reportedBy,
        title: `New Claim for "${item.title}"`,
        message: `${req.user.name} submitted a claim with proof of ownership.`,
        type: 'claim_submitted',
        link: `/items/${item._id}`
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Claim submitted successfully. Campus admin and item reporter will review it.',
      claim
    });
  } catch (err) {
    next(err);
  }
}

// Get claims submitted by the current user
async function getMyClaims(req, res, next) {
  try {
    const claims = await Claim.find({ claimantId: req.user.id });
    return res.status(200).json({
      success: true,
      count: claims.length,
      claims
    });
  } catch (err) {
    next(err);
  }
}

// Get all claims (Admin only)
async function getAllClaims(req, res, next) {
  try {
    const { status } = req.query;
    let claims = await Claim.find();
    
    if (status && status !== 'all') {
      claims = claims.filter(c => c.status === status);
    }

    return res.status(200).json({
      success: true,
      count: claims.length,
      claims
    });
  } catch (err) {
    next(err);
  }
}

// Get claims for a specific item
async function getClaimsForItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    // Only Admin or the reporter can see claims for an item
    if (req.user.role !== 'admin' && item.reportedBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to view claims for this item.'
      });
    }

    const claims = await Claim.find({ itemId: itemId.toString() });
    return res.status(200).json({
      success: true,
      count: claims.length,
      claims
    });
  } catch (err) {
    next(err);
  }
}

// Update claim status (Approve / Reject)
async function updateClaimStatus(req, res, next) {
  try {
    const { claimId } = req.params;
    const { status, reviewNotes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "approved" or "rejected".'
      });
    }

    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found.'
      });
    }

    const item = await Item.findById(claim.itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Associated item no longer exists.'
      });
    }

    // Permission check: Admin or the person who reported the item
    if (req.user.role !== 'admin' && item.reportedBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Only administrators or the item reporter can evaluate this claim.'
      });
    }

    const updatedClaim = await Claim.findByIdAndUpdate(
      claimId,
      {
        status,
        reviewNotes: reviewNotes || (status === 'approved' ? 'Ownership verified and approved.' : 'Claim rejected due to insufficient proof.'),
        reviewedBy: req.user.name
      },
      { new: true }
    );

    // If approved, update item status to claimed and notify claimant
    if (status === 'approved') {
      await Item.findByIdAndUpdate(claim.itemId, { status: 'claimed' });

      // In-app notification to claimant
      await Notification.create({
        userId: claim.claimantId,
        title: `Claim Approved for "${item.title}"!`,
        message: `Your ownership claim for "${item.title}" has been approved by ${req.user.name}. Please coordinate recovery at ${item.location}.`,
        type: 'claim_approved',
        link: `/items/${item._id}`
      });

      // Reject all other pending claims on this item
      const otherClaims = await Claim.find({ itemId: claim.itemId, status: 'pending' });
      for (const other of otherClaims) {
        if (other._id.toString() !== claim._id.toString()) {
          await Claim.findByIdAndUpdate(other._id, {
            status: 'rejected',
            reviewNotes: 'Another verified claim was approved for this item.',
            reviewedBy: req.user.name
          });
          await Notification.create({
            userId: other.claimantId,
            title: `Claim Update for "${item.title}"`,
            message: `Another ownership claim was approved for this item.`,
            type: 'claim_rejected',
            link: `/items/${item._id}`
          });
        }
      }
    } else {
      // Rejection notification
      await Notification.create({
        userId: claim.claimantId,
        title: `Claim Update for "${item.title}"`,
        message: `Your claim was reviewed and marked as rejected: ${reviewNotes || 'Insufficient proof of ownership.'}`,
        type: 'claim_rejected',
        link: `/items/${item._id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Claim successfully marked as ${status}.`,
      claim: updatedClaim
    });
  } catch (err) {
    next(err);
  }
}

// Confirm handover / mark item Received (Reporter or Admin)
async function confirmHandover(req, res, next) {
  try {
    const { claimId } = req.params;
    const { handoverNotes } = req.body;

    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found.'
      });
    }

    const item = await Item.findById(claim.itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Associated item not found.'
      });
    }

    // Permission check: item reporter or admin
    if (req.user.role !== 'admin' && item.reportedBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Only the item reporter or a campus administrator can confirm handover.'
      });
    }

    if (claim.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Item handover can only be confirmed for approved claims.'
      });
    }

    if (claim.isReceived) {
      return res.status(400).json({
        success: false,
        message: 'Handover has already been confirmed for this claim.'
      });
    }

    const now = new Date().toISOString();

    // Update claim
    const updatedClaim = await Claim.findByIdAndUpdate(
      claimId,
      {
        isReceived: true,
        receivedAt: now
      },
      { new: true }
    );

    // Update item
    const updatedItem = await Item.findByIdAndUpdate(
      claim.itemId,
      {
        status: 'received',
        handoverConfirmed: true,
        receivedAt: now,
        receivedConfirmedBy: req.user.id,
        receivedNotes: handoverNotes || 'Handover verified and property returned to owner.'
      },
      { new: true }
    );

    // Reward System: Award 50 points to the finder who reported/returned the item
    let pointsAwarded = 0;
    if (item.reportedBy && item.reportedBy !== 'guest' && !item.finderRewarded) {
      const finder = await User.findById(item.reportedBy);
      if (finder) {
        const history = finder.rewardHistory || [];
        const alreadyRewarded = history.some(h => h.action === 'return_item' && h.itemId === item._id.toString());
        if (!alreadyRewarded) {
          const newPoints = (finder.points || 0) + 50;
          const newWeeklyPoints = (finder.weeklyPoints || 0) + 50;
          const newReturnsCount = (finder.returnsCount || 0) + 1;

          // Determine badge
          let badge = finder.badge || 'Helpful Student';
          if (newPoints >= 300) badge = 'Campus Hero';
          else if (newPoints >= 150 || newReturnsCount >= 3) badge = 'Kindness Champion';
          else if (newPoints >= 50) badge = 'Helpful Student';

          const badges = Array.from(new Set([...(finder.badges || ['Helpful Student']), badge]));

          const updatedHistory = [...history, {
            action: 'return_item',
            points: 50,
            itemId: item._id.toString(),
            itemTitle: item.title,
            claimId: claim._id.toString(),
            date: now,
            reason: 'Successfully returned lost item to owner'
          }];

          await User.findByIdAndUpdate(finder._id, {
            points: newPoints,
            weeklyPoints: newWeeklyPoints,
            returnsCount: newReturnsCount,
            badge,
            badges,
            rewardHistory: updatedHistory
          });

          await Item.findByIdAndUpdate(item._id, { finderRewarded: true });
          pointsAwarded = 50;

          // Notify finder
          await Notification.create({
            userId: finder._id.toString(),
            title: '🌟 50 Hero Points Earned!',
            message: `You successfully returned "${item.title}"! 50 points have been added to your FINDORA Heroes score.`,
            type: 'system',
            link: `/items/${item._id}`
          });
        }
      }
    }

    // Notify claimant that handover was recorded
    await Notification.create({
      userId: claim.claimantId,
      title: `Handover Confirmed for "${item.title}"`,
      message: `Your item was marked as Received! Please submit a 1-5 star rating to reward the finder.`,
      type: 'claim_approved',
      link: `/items/${item._id}`
    });

    return res.status(200).json({
      success: true,
      message: 'Item handover successfully confirmed. Item status updated to Received.',
      item: updatedItem,
      itemStatus: updatedItem.status,
      claim: updatedClaim,
      pointsAwarded
    });
  } catch (err) {
    next(err);
  }
}

// Submit verified feedback / rating (Claimant only, once per completed return)
async function submitFeedback(req, res, next) {
  try {
    const { claimId } = req.params;
    const { rating, feedback } = req.body;

    const numRating = parseInt(rating, 10);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5 stars.'
      });
    }

    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found.'
      });
    }

    // Only the approved claimant can submit feedback
    if (claim.claimantId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Only the verified recipient of this item can submit feedback.'
      });
    }

    if (!claim.isReceived) {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be submitted after successful handover has been confirmed.'
      });
    }

    // Prevent duplicate ratings
    if (claim.rating) {
      return res.status(400).json({
        success: false,
        message: 'Feedback has already been submitted for this return (one rating per return).'
      });
    }

    const now = new Date().toISOString();

    const updatedClaim = await Claim.findByIdAndUpdate(
      claimId,
      {
        rating: numRating,
        feedback: feedback ? feedback.trim() : '',
        feedbackSubmittedAt: now
      },
      { new: true }
    );

    const updatedItem = await Item.findByIdAndUpdate(
      claim.itemId,
      {
        rating: numRating,
        feedback: feedback ? feedback.trim() : '',
        feedbackBy: req.user.id,
        feedbackSubmittedAt: now
      },
      { new: true }
    );

    // Update finder's rating stats & award 10 points if rating >= 4
    const item = await Item.findById(claim.itemId);
    let bonusPoints = 0;
    if (item && item.reportedBy && item.reportedBy !== 'guest') {
      const finder = await User.findById(item.reportedBy);
      if (finder) {
        const ratingsCount = (finder.ratingsCount || 0) + 1;
        const totalRatingPoints = (finder.totalRatingPoints || 0) + numRating;
        const averageRating = Math.round((totalRatingPoints / ratingsCount) * 10) / 10;

        let points = finder.points || 0;
        let weeklyPoints = finder.weeklyPoints || 0;
        const history = finder.rewardHistory || [];

        // Check positive feedback bonus
        if (numRating >= 4) {
          const alreadyBonus = history.some(h => h.action === 'positive_feedback' && h.claimId === claim._id.toString());
          if (!alreadyBonus) {
            bonusPoints = 10;
            points += 10;
            weeklyPoints += 10;
            history.push({
              action: 'positive_feedback',
              points: 10,
              claimId: claim._id.toString(),
              itemId: item._id.toString(),
              date: now,
              reason: `Received verified ${numRating}-star rating from recipient`
            });
          }
        }

        await User.findByIdAndUpdate(finder._id, {
          ratingsCount,
          totalRatingPoints,
          averageRating,
          points,
          weeklyPoints,
          rewardHistory: history
        });

        await Notification.create({
          userId: finder._id.toString(),
          title: `New Verified Rating: ${numRating} ★`,
          message: `${claim.claimantName} rated your return ${numRating} stars!${bonusPoints ? ' (+10 bonus Hero Points)' : ''}`,
          type: 'system',
          link: `/items/${item._id}`
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully. Thank you for recognizing campus honesty!',
      claim: updatedClaim,
      item: updatedItem,
      rating: numRating,
      pointsAwarded: bonusPoints,
      bonusPointsAwarded: bonusPoints
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  submitClaim,
  getMyClaims,
  getAllClaims,
  getClaimsForItem,
  updateClaimStatus,
  confirmHandover,
  submitFeedback
};
