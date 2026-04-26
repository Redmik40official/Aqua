// Reviews & Ratings Manager
class ReviewsManager {
  constructor() {
    this.reviews = [];
    this.currentProductId = null;
  }
  
  async loadReviews(productId, page = 1) {
    try {
      this.currentProductId = productId;
      const response = await reviewsAPI.getByProduct(productId, page);
      this.reviews = response.reviews;
      return response;
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  }
  
  async postReview(productId, rating, title, comment) {
    authManager.requireAuth(async () => {
      try {
        if (!rating || !title) {
          authManager.showNotification('Please provide rating and title', 'warning');
          return;
        }
        
        const response = await reviewsAPI.create({
          productId,
          rating,
          title,
          comment
        });
        
        authManager.showNotification('Review posted successfully!', 'success');
        this.loadReviews(productId);
        return response;
      } catch (error) {
        authManager.showNotification(error.message, 'error');
      }
    });
  }
  
  async markHelpful(reviewId) {
    try {
      await reviewsAPI.markHelpful(reviewId);
      authManager.showNotification('Thank you for your feedback', 'success');
      this.loadReviews(this.currentProductId);
    } catch (error) {
      console.error('Error marking helpful:', error);
    }
  }
  
  async deleteReview(reviewId) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await reviewsAPI.delete(reviewId);
      authManager.showNotification('Review deleted', 'success');
      this.loadReviews(this.currentProductId);
    } catch (error) {
      authManager.showNotification(error.message, 'error');
    }
  }
  
  async getRatingSummary(productId) {
    try {
      return await reviewsAPI.getSummary(productId);
    } catch (error) {
      console.error('Error loading rating summary:', error);
    }
  }
  
  renderReviews(container) {
    if (!container) return;
    
    if (this.reviews.length === 0) {
      container.innerHTML = '<p>No reviews yet. Be the first to review!</p>';
      return;
    }
    
    container.innerHTML = this.reviews.map(review => `
      <div class="review" style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
          <div>
            <strong>${review.username}</strong>
            ${review.verified_purchase ? '<span style="background: #4CAF50; color: white; padding: 2px 8px; border-radius: 3px; font-size: 0.8em; margin-left: 10px;">✓ Verified Purchase</span>' : ''}
          </div>
          <div class="star-rating">
            ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
          </div>
        </div>
        <h4>${review.title}</h4>
        <p>${review.comment}</p>
        <div style="margin-top: 10px; color: #666; font-size: 0.9em;">
          <button onclick="reviewsManager.markHelpful(${review.id})" style="margin-right: 15px;">
            👍 Helpful (${review.helpful_count})
          </button>
          ${authManager.user && authManager.user.id === review.user_id ? `
            <button onclick="reviewsManager.deleteReview(${review.id})">🗑️ Delete</button>
          ` : ''}
        </div>
      </div>
    `).join('');
  }
  
  renderRatingSummary(summary, container) {
    if (!container) return;
    
    const average = summary.total > 0 ? summary.average : 0;
    const ratingPercentages = {
      5: summary.total > 0 ? Math.round((summary.five_star / summary.total) * 100) : 0,
      4: summary.total > 0 ? Math.round((summary.four_star / summary.total) * 100) : 0,
      3: summary.total > 0 ? Math.round((summary.three_star / summary.total) * 100) : 0,
      2: summary.total > 0 ? Math.round((summary.two_star / summary.total) * 100) : 0,
      1: summary.total > 0 ? Math.round((summary.one_star / summary.total) * 100) : 0
    };
    
    container.innerHTML = `
      <div style="display: flex; gap: 40px; align-items: start;">
        <div style="text-align: center;">
          <div style="font-size: 2em; font-weight: bold;">${average.toFixed(1)}</div>
          <div class="star-rating" style="font-size: 1.5em;">
            ${'★'.repeat(Math.round(average))}${'☆'.repeat(5 - Math.round(average))}
          </div>
          <p style="color: #666;">${summary.total} reviews</p>
        </div>
        <div style="flex: 1;">
          ${[5, 4, 3, 2, 1].map(stars => `
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <span style="width: 30px;">${stars} ★</span>
              <div style="flex: 1; height: 5px; background: #eee; border-radius: 5px; margin: 0 10px;">
                <div style="height: 100%; background: #FFC107; width: ${ratingPercentages[stars]}%; border-radius: 5px;"></div>
              </div>
              <span style="width: 30px; text-align: right;">${ratingPercentages[stars]}%</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  renderReviewForm(container, productId) {
    if (!container) return;
    
    container.innerHTML = `
      <form style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
        <h3>Write a Review</h3>
        <div style="margin-bottom: 15px;">
          <label>Rating:</label>
          <div class="star-rating" style="font-size: 2em; cursor: pointer;">
            ${[1, 2, 3, 4, 5].map(i => `
              <span onclick="document.getElementById('rating').value = ${i}" style="margin-right: 10px; cursor: pointer;">☆</span>
            `).join('')}
          </div>
          <input type="hidden" id="rating" value="0">
        </div>
        <div style="margin-bottom: 15px;">
          <label>Title:</label>
          <input type="text" id="review-title" placeholder="Summarize your experience" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
        </div>
        <div style="margin-bottom: 15px;">
          <label>Your Review:</label>
          <textarea id="review-comment" placeholder="Share your honest thoughts..." style="width: 100%; height: 100px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;"></textarea>
        </div>
        <button type="button" onclick="reviewsManager.postReview(${productId}, document.getElementById('rating').value, document.getElementById('review-title').value, document.getElementById('review-comment').value)" class="btn-primary">Submit Review</button>
      </form>
    `;
  }
}

const reviewsManager = new ReviewsManager();

