document.addEventListener('DOMContentLoaded', function() {
    // Create particles for background effect
    const particlesContainer = document.getElementById('particles');
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 5 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const animDuration = Math.random() * 10 + 10;
        const animDelay = Math.random() * 5;

        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = posX + '%';
        particle.style.top = posY + '%';
        particle.style.animation = `float ${animDuration}s ease-in-out ${animDelay}s infinite, pulse 4s ease-in-out infinite`;

        particlesContainer.appendChild(particle);
    }

    // Initialize FancyBox for image gallery
    if (typeof $.fn.fancybox !== 'undefined') {
        $('[data-fancybox="gallery"]').fancybox({
            buttons: [
                "zoom",
                "slideShow",
                "fullScreen",
                "download",
                "close"
            ],
            loop: true,
            animationEffect: "fade"
        });
    }

    // Video error handling
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.addEventListener('error', function(e) {
            console.error('Error loading video:', e);
            video.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; background-color: rgba(0,0,0,0.7);"><i class="fas fa-exclamation-triangle" style="color: #ff4d4d; margin-right: 10px;"></i> Video unavailable</div>';
        });
    });
    // Функция для подтверждения удаления комментария
    window.confirmDelete = function(commentId) {
        const confirmationModal = document.getElementById('deleteConfirmation');
        const confirmBtn = document.getElementById('confirmDeleteBtn');

        // Показываем модальное окно
        confirmationModal.classList.add('visible');

        // Настраиваем кнопку подтверждения
        confirmBtn.onclick = function() {
            deleteComment(commentId);
        };
    };

// Функция для отмены удаления
    window.cancelDelete = function() {
        const confirmationModal = document.getElementById('deleteConfirmation');
        confirmationModal.classList.remove('visible');
    };

// Функция для выполнения удаления комментария
    function deleteComment(commentId) {
        const postId = window.location.pathname.split('/').pop();
        const commentElement = document.querySelector(`.comment[data-id="${commentId}"]`);
        commentElement.classList.add('deleting');

        fetch(`/post/${postId}/comment/${commentId}/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]').content
            }
        })
            .then(response => {
                if (response.ok) {
                    // Если запрос успешный, удаляем элемент после завершения анимации
                    setTimeout(() => {
                        commentElement.remove();
                        // Если комментариев не осталось, показываем сообщение
                        if (document.querySelectorAll('.comment').length === 0) {
                            const commentsSection = document.querySelector('.comments-section');
                            const noCommentsMessage = document.createElement('div');
                            noCommentsMessage.style.padding = '20px';
                            noCommentsMessage.style.textAlign = 'center';
                            noCommentsMessage.style.color = 'var(--text-muted)';
                            noCommentsMessage.innerHTML = `
                    <i class="fas fa-comment-slash fa-2x" style="margin-bottom: 10px;"></i>
                    <p>No comments yet. Be the first to share your thoughts!</p>
                `;
                            commentsSection.appendChild(noCommentsMessage);
                        }
                    }, 500);
                } else {
                    // Если запрос не успешный, показываем уведомление об ошибке
                    alert('Error deleting comment. Please try again.');
                    commentElement.classList.remove('deleting');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error deleting comment. Please try again.');
                commentElement.classList.remove('deleting');
            })
            .finally(() => {
                // Закрываем модальное окно
                cancelDelete();
            });
    }
});
function togglePostMenu() {
    const menu = document.getElementById('postActionsMenu');
    menu.classList.toggle('visible');
}

// Click outside to close menu
document.addEventListener('click', function(event) {
    const menu = document.getElementById('postActionsMenu');
    const button = document.querySelector('.manage-post-btn');

    if (menu && button) {
        if (!menu.contains(event.target) && !button.contains(event.target)) {
            menu.classList.remove('visible');
        }
    }
});

// Post delete confirmation
function confirmPostDelete() {
    const confirmationModal = document.getElementById('deletePostConfirmation');
    const confirmBtn = document.getElementById('confirmPostDeleteBtn');
    const postId = window.location.pathname.split('/').pop();

    // Show modal
    confirmationModal.classList.add('visible');

    // Setup confirmation button
    confirmBtn.onclick = function() {
        deletePost(postId);
    };
}

function cancelPostDelete() {
    const confirmationModal = document.getElementById('deletePostConfirmation');
    confirmationModal.classList.remove('visible');
}

function deletePost(postId) {
    // Add fading effect
    document.querySelector('.post-card').classList.add('deleting');

    fetch(`/post/${postId}/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]').content
        }
    })
        .then(response => {
            if (response.ok) {
                // Redirect to home page after successful deletion
                window.location.href = '/forum/forum';
            } else {
                alert('Error deleting post. Please try again.');
                document.querySelector('.post-card').classList.remove('deleting');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting post. Please try again.');
            document.querySelector('.post-card').classList.remove('deleting');
        })
        .finally(() => {
            cancelPostDelete();
        });
}
document.addEventListener('DOMContentLoaded', function() {
    const likeButton = document.getElementById('likeButton');
    const likeIcon = document.getElementById('likeIcon');
    const likeCount = document.getElementById('likeCount');

    const dislikeButton = document.getElementById('dislikeButton');
    const dislikeIcon = document.getElementById('dislikeIcon');
    const dislikeCount = document.getElementById('dislikeCount');

    // Get initial state from hidden fields
    const isPostLikedElement = document.getElementById('isPostLiked');
    const isPostDislikedElement = document.getElementById('isPostDisliked');

    if (likeButton && dislikeButton) {
        // Track state
        let isLiked = isPostLikedElement && isPostLikedElement.value === 'true';
        let isDisliked = isPostDislikedElement && isPostDislikedElement.value === 'true';
        let likes = parseInt(likeCount.textContent) || 0;
        let dislikes = parseInt(dislikeCount.textContent) || 0;

        // Initial UI update
        updateLikeUI();
        updateDislikeUI();

        // Get CSRF token for requests
        const token = document.querySelector('meta[name="_csrf"]').getAttribute('content');
        const header = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

        // Like button click handler
        likeButton.addEventListener('click', function() {
            const postId = likeButton.getAttribute('data-postid');
            handleLike(postId);
        });

        // Dislike button click handler
        dislikeButton.addEventListener('click', function() {
            const postId = dislikeButton.getAttribute('data-postid');
            handleDislike(postId);
        });

        function handleLike(postId) {
            // Store previous state for rollback if needed
            const previousState = {
                isLiked,
                likes,
                isDisliked,
                dislikes
            };

            // Optimistically update UI state
            if (isDisliked) {
                isDisliked = false;
                dislikes--;
                updateDislikeUI();
            }

            isLiked = !isLiked;
            likes = isLiked ? likes + 1 : likes - 1;
            updateLikeUI();

            // Animate counter
            animateCounter(likeCount);

            // Send request to server
            fetch(`/api/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    [header]: token
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Server response was not OK');
                    }
                    return response.json();
                })
                .then(data => {
                    // Update with server values
                    isLiked = data.liked;
                    likes = data.likeCount;

                    // Server should have removed any dislike, so update that too
                    isDisliked = false;
                    dislikes = data.dislikeCount !== undefined ? data.dislikeCount : dislikes;

                    updateLikeUI();
                    updateDislikeUI();
                })
                .catch(error => {
                    console.error('Error processing like:', error);

                    // Rollback to previous state on error
                    isLiked = previousState.isLiked;
                    likes = previousState.likes;
                    isDisliked = previousState.isDisliked;
                    dislikes = previousState.dislikes;

                    updateLikeUI();
                    updateDislikeUI();

                    showErrorNotification('Error processing your like. Please try again.');
                });
        }

        function handleDislike(postId) {
            // Store previous state for rollback if needed
            const previousState = {
                isLiked,
                likes,
                isDisliked,
                dislikes
            };

            // Optimistically update UI state
            if (isLiked) {
                isLiked = false;
                likes--;
                updateLikeUI();
            }

            isDisliked = !isDisliked;
            dislikes = isDisliked ? dislikes + 1 : dislikes - 1;
            updateDislikeUI();

            // Animate counter
            animateCounter(dislikeCount);

            // Send request to server
            fetch(`/api/posts/${postId}/dislike`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    [header]: token
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Server response was not OK');
                    }
                    return response.json();
                })
                .then(data => {
                    // Update with server values - handle both key formats for compatibility
                    isDisliked = data.disliked !== undefined ? data.disliked : data.isDisliked;
                    dislikes = data.dislikeCount !== undefined ? data.dislikeCount : data.dislikes;

                    // Server should have removed any like, so update that too
                    isLiked = false;
                    likes = data.likeCount !== undefined ? data.likeCount : likes;

                    updateLikeUI();
                    updateDislikeUI();
                })
                .catch(error => {
                    console.error('Error processing dislike:', error);

                    // Rollback to previous state on error
                    isLiked = previousState.isLiked;
                    likes = previousState.likes;
                    isDisliked = previousState.isDisliked;
                    dislikes = previousState.dislikes;

                    updateLikeUI();
                    updateDislikeUI();

                    showErrorNotification('Error processing your dislike. Please try again.');
                });
        }

        // Helper functions
        function updateLikeUI() {
            likeButton.classList.toggle('liked', isLiked);
            likeIcon.className = isLiked ? 'fas fa-thumbs-up' : 'far fa-thumbs-up';
            likeCount.textContent = likes;
        }

        function updateDislikeUI() {
            dislikeButton.classList.toggle('disliked', isDisliked);
            dislikeIcon.className = isDisliked ? 'fas fa-thumbs-down' : 'far fa-thumbs-down';
            dislikeCount.textContent = dislikes;
        }

        function animateCounter(element) {
            element.classList.add('updated');
            setTimeout(() => {
                element.classList.remove('updated');
            }, 500);
        }

        function showErrorNotification(message) {
            // Create a user-friendly notification instead of an alert
            const notification = document.createElement('div');
            notification.className = 'error-notification';
            notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
            document.body.appendChild(notification);

            // Remove after a delay
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }, 3000);
        }
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Initialize branch creation functionality
    const createBranchBtn = document.getElementById('createBranchBtn');
    const createBranchModal = document.getElementById('createBranchModal');

    if (createBranchBtn) {
        createBranchBtn.addEventListener('click', function() {
            // Pre-populate the branch content with the original post content
            const originalContent = document.querySelector('.post-content .content p').textContent;
            document.getElementById('branchContent').value = originalContent;

            // Show the modal
            createBranchModal.classList.add('visible');
        });
    }

    // Initialize branch filtering functionality
    const branchFilter = document.getElementById('branchFilter');
    if (branchFilter) {
        branchFilter.addEventListener('change', function() {
            const selectedFilter = this.value;
            const branchItems = document.querySelectorAll('.branch-item');
            const userId = document.querySelector('.profile .username span').getAttribute('data-userid');

            branchItems.forEach(branch => {
                const branchVisibility = branch.getAttribute('data-visibility');
                const branchOwnerId = branch.querySelector('.branch-meta a').getAttribute('data-userid');

                switch(selectedFilter) {
                    case 'all':
                        branch.style.display = 'block';
                        break;
                    case 'public':
                        branch.style.display = branchVisibility === 'PUBLIC' ? 'block' : 'none';
                        break;
                    case 'private':
                        branch.style.display = branchVisibility === 'PRIVATE' ? 'block' : 'none';
                        break;
                    case 'my':
                        branch.style.display = branchOwnerId === userId ? 'block' : 'none';
                        break;
                }
            });

            // Show/hide no branches message
            updateNoBranchesMessage();
        });
    }

    // Initialize branch actions (delete, merge request, etc.)
    initBranchActions();

    // Initialize branch comparison
    initBranchComparison();
});

/**
 * Initialize branch action buttons (delete, request merge, view merge request)
 */
function initBranchActions() {
    const branchActions = document.querySelectorAll('.branch-action');
    branchActions.forEach(action => {
        const actionText = action.querySelector('span').textContent.trim();

        // Delete action
        if (actionText === 'Delete') {
            action.addEventListener('click', function() {
                const branchItem = this.closest('.branch-item');
                const branchId = branchItem.getAttribute('data-id');
                confirmBranchDelete(branchId);
            });
        }

        // Request merge action
        if (actionText === 'Request Merge') {
            action.addEventListener('click', function() {
                const branchItem = this.closest('.branch-item');
                const branchId = branchItem.getAttribute('data-id');
                requestMerge(branchId);
            });
        }

        // View merge request action
        if (actionText === 'View Merge Request') {
            action.addEventListener('click', function() {
                const branchItem = this.closest('.branch-item');
                const branchId = branchItem.getAttribute('data-id');
                viewMergeRequest(branchId);
            });
        }
    });
}

/**
 * Initialize branch comparison section
 */
// Update the branch view button to open modal instead of navigating
document.querySelectorAll('.branch-view-btn').forEach(viewBtn => {
    viewBtn.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default navigation

        const branchItem = this.closest('.branch-item');
        const branchId = branchItem.getAttribute('data-id');
        const branchTitle = branchItem.querySelector('.branch-title').textContent;

        openBranchComparisonModal(branchId, branchTitle);

        return false;
    });
});

// Function to open branch comparison modal
function openBranchComparisonModal(branchId, branchTitle) {
    const modal = document.getElementById('branchComparisonModal');
    const titleDisplay = modal.querySelector('.branch-title-display');
    const comparisonContent = modal.querySelector('.comparison-content');

    // Set title
    titleDisplay.innerHTML = `<h4>${branchTitle}</h4>`;

    // Show loading state
    comparisonContent.innerHTML = '<div class="loading-comparison"><i class="fas fa-spinner fa-spin"></i> Loading comparison...</div>';

    // Show modal
    modal.classList.add('visible');

    // Load comparison data
    loadBranchComparison(branchId, comparisonContent);
}

// Function to close branch comparison modal
function closeBranchComparisonModal() {
    document.getElementById('branchComparisonModal').classList.remove('visible');
}

// Function to load branch comparison data

function getPostIdFromUrl() {
    // Extract the post ID from the current URL
    // Assuming your URL pattern is something like /posts/123 or /forum/post/123
    const pathParts = window.location.pathname.split('/');
    // Find the part that looks like a number
    for (let i = 0; i < pathParts.length; i++) {
        if (!isNaN(pathParts[i]) && pathParts[i] !== '') {
            return parseInt(pathParts[i]);
        }
    }
    // Fallback - get from a data attribute if available
    const postIdElement = document.querySelector('[data-post-id]');
    if (postIdElement) {
        return postIdElement.getAttribute('data-post-id');
    }
    console.error('Could not determine post ID from URL');
    return null;
}

// Modify the loadBranchComparison function to include better error handling
function loadBranchComparison(branchId, container) {
    const postId = getPostIdFromUrl();

    if (!postId) {
        container.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Could not determine post ID. Please try again.</div>';
        return;
    }

    console.log(`Loading comparison for postId=${postId}, branchId=${branchId}`);

    fetch(`/api/branch/post/${postId}/branch/${branchId}/compare`, {
        method: 'GET',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]').content,
            'Accept': 'application/json'
        }
    })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Received data:', data);
            // Check if the data contains the expected differences property
            if (data.differences !== undefined) {
                // Render the diff view using existing renderDiffView function
                renderDiffView(data, container);
            } else {
                console.error('Response does not contain differences property:', data);
                container.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Invalid response format. Please try again.</div>';
            }
        })
        .catch(error => {
            console.error('Error fetching comparison:', error);
            container.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Error loading comparison: ' + error.message + '</div>';
        });
}

// Update renderDiffView to accept a container parameter
function renderDiffView(data, container = document.querySelector('.comparison-content')) {
    // Handle null or undefined differences
    if (!data || !data.differences) {
        container.innerHTML = '<div class="no-changes-message"><i class="fas fa-info-circle"></i> No differences found or invalid response format.</div>';
        return;
    }

    // Check if differences is an empty string
    if (data.differences.trim() === '') {
        container.innerHTML = '<div class="no-changes-message"><i class="fas fa-info-circle"></i> No differences found between this branch and the original post.</div>';
        return;
    }

    const diffView = document.createElement('div');
    diffView.className = 'diff-view';

    // Split the string into lines
    const diffLines = data.differences.split('\n');

    // Process each line
    diffLines.forEach(line => {
        if (line.trim() === '') return; // Skip empty lines

        const diffLine = document.createElement('div');
        const lineIndicator = document.createElement('span');
        lineIndicator.className = 'line-indicator';
        const lineContent = document.createElement('span');
        lineContent.className = 'line-content';

        // Determine line type (added, removed, unchanged)
        if (line.startsWith('+ ')) {
            diffLine.className = 'diff-line added';
            lineIndicator.textContent = '+';
            lineContent.textContent = line.substring(2); // Remove "+ " from content
        } else if (line.startsWith('- ')) {
            diffLine.className = 'diff-line removed';
            lineIndicator.textContent = '-';
            lineContent.textContent = line.substring(2); // Remove "- " from content
        } else {
            diffLine.className = 'diff-line unchanged';
            lineIndicator.textContent = ' ';
            lineContent.textContent = line;
        }

        // Add elements to the line
        diffLine.appendChild(lineIndicator);
        diffLine.appendChild(lineContent);

        // Add the line to the view
        diffView.appendChild(diffLine);
    });

    // Clear the container and add the new view
    container.innerHTML = '';
    container.appendChild(diffView);
}

/**
 * Update the no branches message visibility
 */
function updateNoBranchesMessage() {
    const visibleBranches = document.querySelectorAll('.branch-item[style="display: block"]');
    const noBranchesMessage = document.querySelector('.no-branches-message');

    if (noBranchesMessage) {
        if (visibleBranches.length === 0) {
            noBranchesMessage.style.display = 'flex';
        } else {
            noBranchesMessage.style.display = 'none';
        }
    }
}

/**
 * Close the create branch modal
 */
function closeCreateBranchModal() {
    document.getElementById('createBranchModal').classList.remove('visible');
}

/**
 * Show the branch delete confirmation modal
 * @param {string} branchId - The ID of the branch to delete
 */
function confirmBranchDelete(branchId) {
    const confirmationModal = document.getElementById('deleteBranchConfirmation');
    const confirmBtn = document.getElementById('confirmBranchDeleteBtn');

    // Show modal
    confirmationModal.classList.add('visible');

    // Setup confirmation button
    confirmBtn.onclick = function() {
        deleteBranch(branchId);
    };
}

/**
 * Cancel branch deletion and close the confirmation modal
 */
function cancelBranchDelete() {
    document.getElementById('deleteBranchConfirmation').classList.remove('visible');
}

/**
 * Delete a branch from the system
 * @param {string} branchId - The ID of the branch to delete
 */
function deleteBranch(branchId) {
    const postId = getPostIdFromUrl();
    const branchElement = document.querySelector(`.branch-item[data-id="${branchId}"]`);
    branchElement.classList.add('deleting');

    fetch(`/api/branch/post/${postId}/branch/${branchId}/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]').content
        }
    })
        .then(response => {
            if (response.ok) {
                // If request successful, remove element after animation completes
                setTimeout(() => {
                    branchElement.remove();

                    // Update the branch visualization graph
                    const branchNodes = document.querySelectorAll(`.branch-graph-line`);
                    branchNodes.forEach(node => {
                        if (node.querySelector('.branch-node-text').textContent === branchElement.querySelector('.branch-title').textContent) {
                            node.remove();
                        }
                    });

                    // Check if any branches remain
                    updateBranchesListAfterDeletion();

                    // Show success notification
                    showNotification('Branch deleted successfully.', 'success');
                }, 500);
            } else {
                // If request fails, show notification
                showNotification('Error deleting branch. Please try again.', 'error');
                branchElement.classList.remove('deleting');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error deleting branch. Please try again.', 'error');
            branchElement.classList.remove('deleting');
        })
        .finally(() => {
            cancelBranchDelete();
        });
}

/**
 * Update the branches list UI after a branch is deleted
 */
function updateBranchesListAfterDeletion() {
    // Check if any branches remain
    if (document.querySelectorAll('.branch-item').length === 0) {
        const noBranchesMessage = document.createElement('div');
        noBranchesMessage.className = 'no-branches-message';
        noBranchesMessage.innerHTML = `
        <i class="fas fa-code-branch fa-2x"></i>
        <p>No branches have been created for this post yet. Create the first branch to propose changes or extensions!</p>
    `;
        document.getElementById('branchesList').appendChild(noBranchesMessage);
    }

    // Update branch comparison dropdown if it exists
    const comparisonSelect = document.getElementById('branchComparisonSelect');
    if (comparisonSelect) {
        // Reset to default
        comparisonSelect.value = 'none';
        document.querySelector('.comparison-content').innerHTML = '<div class="select-branch-message"><i class="fas fa-code-compare"></i> Select a branch to compare with the original post.</div>';
    }
}

/**
 * Request to merge a branch with the main post
 * @param {string} branchId - The ID of the branch to request merging
 */
function requestMerge(branchId) {
    const postId = getPostIdFromUrl();

    // Change the branch action button to show loading state
    let requestButton = Array.from(document.querySelectorAll(`.branch-item[data-id="${branchId}"] .branch-action`))
        .find(action => action.querySelector('span')?.textContent.includes("Request Merge"));
    if (!requestButton) {
        // Alternative selector for broader browser support
        const allBranchActions = document.querySelectorAll(`.branch-item[data-id="${branchId}"] .branch-action`);
        for (let action of allBranchActions) {
            if (action.querySelector('span').textContent.includes('Request Merge')) {
                requestButton = action;
                break;
            }
        }
    }

    const originalHTML = requestButton.innerHTML;
    requestButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Processing...</span>';
    requestButton.style.pointerEvents = 'none';

    fetch(`/api/merge-requests/post/${postId}/branch/${branchId}/merge-request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]').content
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Server response was not OK');
            }
        })
        .then(data => {
            // Update the UI to reflect the new merge request
            requestButton.innerHTML = '<i class="fas fa-code-merge"></i> <span>View Merge Request</span>';
            requestButton.style.pointerEvents = 'auto';

            // Add the merge request indicator to the branch
            const branchItem = document.querySelector(`.branch-item[data-id="${branchId}"]`);
            branchItem.classList.add('has-merge-request');

            // Show success notification
            showNotification('Merge request created successfully.', 'success');

            // Add merge request panel if user is post owner or admin
            const isPostOwner = data.isPostOwner;
            const isAdmin = data.isAdmin || data.isModerator;

            if (isPostOwner || isAdmin) {
                insertMergeRequestPanel(data);
            }
        })
        .catch(error => {
            console.error('Error creating merge request:', error);
            requestButton.innerHTML = originalHTML;
            requestButton.style.pointerEvents = 'auto';
            showNotification('Error creating merge request. Please try again.', 'error');
        });
}

/**
 * Insert merge request panel into the DOM
 * @param {Object} data - The merge request data from the server
 */
function insertMergeRequestPanel(data) {
    const mergeRequestPanel = document.createElement('div');
    mergeRequestPanel.className = 'merge-request-panel';
    mergeRequestPanel.innerHTML = `
    <div class="merge-request-info">
        <div class="merge-request-title">
            <i class="fas fa-code-merge"></i>
            <span>Merge Request Pending</span>
        </div>
        <div class="merge-request-description">
            <span>${data.requestOwner}</span> has requested to merge their branch
            "<span>${data.branchTitle}</span>" into the main post.
        </div>
    </div>
    <div class="merge-request-actions">
        <button class="merge-action-btn merge-reject-btn" onclick="rejectMergeRequest(${data.mergeRequestId})">
            <i class="fas fa-times"></i> Reject
        </button>
        <button class="merge-action-btn merge-approve-btn" onclick="approveMergeRequest(${data.mergeRequestId})">
            <i class="fas fa-check"></i> Approve
        </button>
    </div>
`;

    // Insert the panel before branches list
    const branchesSection = document.querySelector('.branches-section');
    const branchesList = document.getElementById('branchesList');
    if (branchesSection && branchesList) {
        branchesSection.insertBefore(mergeRequestPanel, branchesList);
    }
}

/**
 * Navigate to view merge request details
 * @param {string} branchId - The ID of the branch with the merge request
 */
function viewMergeRequest(branchId) {
    const postId = getPostIdFromUrl();
    window.location.href = `/post/${postId}/branch/${branchId}/merge-request`;
}

/**
 * Approve a merge request
 * @param {string} mergeRequestId - The ID of the merge request to approve
 */
function approveMergeRequest(mergeRequestId) {
    const postId = getPostIdFromUrl();

    // Show loading state
    const approveButton = document.querySelector('.merge-approve-btn');
    const originalHTML = approveButton.innerHTML;
    approveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    approveButton.disabled = true;

    fetch(`/api/merge-requests/post/${postId}/merge-request/${mergeRequestId}/approve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]').content
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Server response was not OK');
            }
        })
        .then(data => {
            // Show success notification
            showNotification('Branch merged successfully! The post has been updated.', 'success');

            // Reload the page after a short delay to show the updated content
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        })
        .catch(error => {
            console.error('Error approving merge request:', error);
            approveButton.innerHTML = originalHTML;
            approveButton.disabled = false;
            showNotification('Error approving merge request. Please try again.', 'error');
        });
}

/**
 * Reject a merge request
 * @param {string} mergeRequestId - The ID of the merge request to reject
 */
function rejectMergeRequest(mergeRequestId) {
    const postId = getPostIdFromUrl();

    // Show loading state
    const rejectButton = document.querySelector('.merge-reject-btn');
    const originalHTML = rejectButton.innerHTML;
    rejectButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    rejectButton.disabled = true;

    fetch(`/api/merge-requests/post/${postId}/merge-request/${mergeRequestId}/reject`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]').content
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Server response was not OK');
            }
        })
        .then(data => {
            // Show success notification
            showNotification('Merge request rejected.', 'info');

            // Remove the merge request panel
            const mergeRequestPanel = document.querySelector('.merge-request-panel');
            if (mergeRequestPanel) {
                mergeRequestPanel.remove();
            }

            // Update the branch item to remove merge request indicator
            const branchItem = document.querySelector(`.branch-item[data-id="${data.branchId}"]`);
            if (branchItem) {
                branchItem.classList.remove('has-merge-request');

                // Update the action button
                let actionButton = Array.from(branchItem.querySelectorAll('.branch-action')).find(action => {
                    const span = action.querySelector('span');
                    return span && span.textContent.includes("View Merge Request");
                });
                if (!actionButton) {
                    // Alternative selector for broader browser support
                    const allBranchActions = document.querySelectorAll(`.branch-item[data-id="${data.branchId}"] .branch-action`);
                    for (let action of allBranchActions) {
                        if (action.querySelector('span').textContent.includes('View Merge Request')) {
                            actionButton = action;
                            break;
                        }
                    }
                }

                if (actionButton) {
                    actionButton.innerHTML = '<i class="fas fa-code-pull-request"></i> <span>Request Merge</span>';
                }
            }
        })
        .catch(error => {
            console.error('Error rejecting merge request:', error);
            rejectButton.innerHTML = originalHTML;
            rejectButton.disabled = false;
            showNotification('Error rejecting merge request. Please try again.', 'error');
        });
}

/**
 * Render the diff view for branch comparison
 * @param {Object} data - The diff data from the server
 */
function renderDiffView(data) {
    const diffContainer = document.querySelector('.comparison-content');
    const diffView = document.createElement('div');
    diffView.className = 'diff-view';

    // Check if there are differences
    if (data.differences.length === 0) {
        diffContainer.innerHTML = '<div class="no-changes-message"><i class="fas fa-info-circle"></i> No differences found between this branch and the original post.</div>';
        return;
    }

    // Add the diff lines
    data.differences.forEach(diff => {
        const diffLine = document.createElement('div');

        // Set the line class based on type (added, removed, unchanged)
        diffLine.className = `diff-line ${diff.type}`;

        // Add line indicator
        const lineIndicator = document.createElement('span');
        lineIndicator.className = 'line-indicator';

        switch (diff.type) {
            case 'added':
                lineIndicator.textContent = '+';
                break;
            case 'removed':
                lineIndicator.textContent = '-';
                break;
            default:
                lineIndicator.textContent = ' ';
        }

        // Create line content
        const lineContent = document.createElement('span');
        lineContent.className = 'line-content';
        lineContent.textContent = diff.content;

        // Append to diff line
        diffLine.appendChild(lineIndicator);
        diffLine.appendChild(lineContent);

        // Add to diff view
        diffView.appendChild(diffLine);
    });

    // Clear the container and add the new diff view
    diffContainer.innerHTML = '';
    diffContainer.appendChild(diffView);
}

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }

    // Remove any existing classes
    notification.className = 'notification';
    notification.classList.add(`${type}-notification`);

    // Set icon based on type
    let icon = 'info-circle';
    switch (type) {
        case 'success':
            icon = 'check-circle';
            break;
        case 'error':
            icon = 'exclamation-circle';
            break;
        case 'warning':
            icon = 'exclamation-triangle';
            break;
    }

    // Set content
    notification.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
/**
 * Submit a new branch
 */
function submitBranch(event) {
    // Prevent the default form submission
    event.preventDefault();

    const form = document.getElementById('createBranchForm');
    const postId = getPostIdFromUrl();

    // Get form values
    const branchTitle = document.getElementById('branchTitle').value;
    const branchDescription = document.getElementById('branchDescription').value;
    const branchContent = document.getElementById('branchContent').value;
    // Fix the name of the input to match your HTML
    const visibility = document.querySelector('input[name="visibility"]:checked').value;

    // Validate form
    if (!branchTitle.trim() || !branchContent.trim()) {
        showNotification('Please fill in all required fields.', 'warning');
        return;
    }

    // Show loading on submit button
    const submitBtn = document.querySelector('.submit-btn');
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
    submitBtn.disabled = true;

    // Submit data
    fetch(`/api/branch/post/${postId}/branch/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]').content
        },
        body: JSON.stringify({
            title: branchTitle,
            description: branchDescription,
            content: branchContent,
            visibility: visibility
        })
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Server response was not OK');
            }
        })
        .then(data => {
            // Close modal
            closeCreateBranchModal();

            // Show success notification
            showNotification('Branch created successfully!', 'success');

            // Reload the page after a short delay to show the new branch
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        })
        .catch(error => {
            console.error('Error creating branch:', error);
            submitBtn.innerHTML = originalBtnHTML;
            submitBtn.disabled = false;
            showNotification('Error creating branch. Please try again.', 'error');
        });
}

/**
 * Initialize any tooltips on the page
 */
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseover', function() {
            const tooltipText = this.getAttribute('data-tooltip');

            // Create tooltip element
            const tooltipEl = document.createElement('div');
            tooltipEl.className = 'tooltip';
            tooltipEl.textContent = tooltipText;

            // Position and append to body
            const rect = this.getBoundingClientRect();
            tooltipEl.style.top = `${rect.top - 30}px`;
            tooltipEl.style.left = `${rect.left + (rect.width / 2)}px`;

            document.body.appendChild(tooltipEl);

            // Store the tooltip element reference
            this.tooltipEl = tooltipEl;
        });

        tooltip.addEventListener('mouseout', function() {
            if (this.tooltipEl) {
                this.tooltipEl.remove();
                this.tooltipEl = null;
            }
        });
    });
}

/**
 * Handle theme switching
 */
function initThemeSwitching() {
    const themeSwitch = document.getElementById('themeSwitch');
    if (themeSwitch) {
        themeSwitch.addEventListener('click', function() {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            // Update body attribute
            document.body.setAttribute('data-theme', newTheme);

            // Store preference in localStorage
            localStorage.setItem('theme', newTheme);

            // Update switch icon
            const switchIcon = this.querySelector('i');
            if (newTheme === 'dark') {
                switchIcon.classList.remove('fa-sun');
                switchIcon.classList.add('fa-moon');
            } else {
                switchIcon.classList.remove('fa-moon');
                switchIcon.classList.add('fa-sun');
            }
        });
    }
}

/**
 * Apply the stored theme or default theme
 */
function applyStoredTheme() {
    const storedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', storedTheme);

    // Update switch icon if it exists
    const themeSwitch = document.getElementById('themeSwitch');
    if (themeSwitch) {
        const switchIcon = themeSwitch.querySelector('i');
        if (storedTheme === 'dark') {
            switchIcon.classList.remove('fa-sun');
            switchIcon.classList.add('fa-moon');
        } else {
            switchIcon.classList.remove('fa-moon');
            switchIcon.classList.add('fa-sun');
        }
    }
}

// Apply stored theme when page loads
document.addEventListener('DOMContentLoaded', function() {
    applyStoredTheme();
    initThemeSwitching();
    initTooltips();
});

// Initialize branch view buttons on page load
document.addEventListener('DOMContentLoaded', function() {
    // Other initialization code...

    // Initialize branch view buttons
    document.querySelectorAll('.branch-view-btn').forEach(viewBtn => {
        viewBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default navigation

            const branchItem = this.closest('.branch-item');
            const branchId = branchItem.getAttribute('data-id');
            const branchTitle = branchItem.querySelector('.branch-title').textContent;

            openBranchComparisonModal(branchId, branchTitle);

            return false;
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    enhanceCodeBlocks();
});

function enhanceCodeBlocks() {
    // Find all code blocks
    const codeBlocks = document.querySelectorAll('pre code');

    codeBlocks.forEach((codeBlock, index) => {
        // Get parent pre element
        const preBlock = codeBlock.parentElement;

        // Check if header already exists to prevent duplication
        if (preBlock.querySelector('.code-header')) {
            return;
        }

        // Determine language from class
        let language = 'plaintext';
        const classNames = codeBlock.className.split(' ');
        for (const className of classNames) {
            if (className.startsWith('language-')) {
                language = className.replace('language-', '');
                break;
            }
        }

        // Create header bar
        const header = document.createElement('div');
        header.className = 'code-header';

        // Add language label
        const langLabel = document.createElement('span');
        langLabel.className = 'code-language';
        langLabel.textContent = language !== 'plaintext' ? language.toUpperCase() : 'TEXT';
        header.appendChild(langLabel);

        // Add copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'code-copy-btn';
        copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
        copyButton.dataset.codeId = `code-${index}`;
        copyButton.onclick = function() {
            copyCodeToClipboard(this);
        };
        header.appendChild(copyButton);

        // Insert header before code block
        preBlock.insertBefore(header, codeBlock);

        // Add unique ID
        codeBlock.id = `code-${index}`;

        // Add line numbers (optional)
        if (language !== 'plaintext') {
            addLineNumbers(codeBlock);
        }
    });
}

// Function to add line numbers
function addLineNumbers(codeBlock) {
    const content = codeBlock.innerHTML;
    const lines = content.split('\n');
    const numberedLines = lines.map(line =>
        line ? `<span class="line">${line}</span>` : ''
    );
    codeBlock.innerHTML = numberedLines.join('\n');
}

// Function to copy code to clipboard
function copyCodeToClipboard(button) {
    const codeId = button.dataset.codeId;
    const codeBlock = document.getElementById(codeId);
    const text = codeBlock.textContent;

    navigator.clipboard.writeText(text).then(() => {
        // Change button text temporarily
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.style.color = '#8CFF5D';

        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        // Fallback for older browsers
        fallbackCopyTextToClipboard(text, button);
    });
}

// Fallback copy method for older browsers
function fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Copied!';
            button.style.color = '#8CFF5D';

            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.color = '';
            }, 2000);
        }
    } catch (err) {
        console.error('Fallback: Failed to copy', err);
    }

    document.body.removeChild(textArea);
}