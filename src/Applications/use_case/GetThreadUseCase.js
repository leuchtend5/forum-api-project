class GetThreadUseCase {
  constructor(threadRepository, commentRepository, replyRepository, likeRepository) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    await this._threadRepository.validateThreadById(threadId);
    const detailThread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentByThreadId(threadId);
    const replies = await this._replyRepository.getReplyByThreadId(threadId);

    // Combine comments, replies, and likeCount
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const { is_deleted, ...commentWithoutIsDeleted } = comment; // to hide is_deleted property
        const likes = await this._likeRepository.getLikeByCommentId(comment.id); // get likeCount by commentId
        const likeCount = likes.length;
        const commentReplies = replies
          .filter((reply) => reply.comment_id === comment.id)
          .map(({ comment_id, is_deleted, ...replyWithoutCommentId }) => replyWithoutCommentId); // to hide comment_id and is_deleted property
        return { ...commentWithoutIsDeleted, replies: commentReplies, likeCount };
      }),
    );

    return { ...detailThread, comments: commentsWithReplies };
  }
}

module.exports = GetThreadUseCase;
