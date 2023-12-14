class GetThreadUseCase {
  constructor(threadRepository, commentRepository, replyRepository) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    await this._threadRepository.validateThreadById(threadId);
    const detailThread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentByThreadId(threadId);
    const replies = await this._replyRepository.getReplyByThreadId(threadId);

    // Combine comments and replies
    const commentsWithReplies = comments.map((comment) => {
      const { is_deleted, ...commentWithoutIsDeleted } = comment; // to hide is_deleted property

      const commentReplies = replies
        .filter((reply) => reply.comment_id === comment.id)
        .map(({ comment_id, is_deleted, ...replyWithoutCommentId }) => replyWithoutCommentId); // to hide comment_id and is_deleted property
      return { ...commentWithoutIsDeleted, replies: commentReplies };
    });

    return { ...detailThread, comments: commentsWithReplies };
  }
}

module.exports = GetThreadUseCase;
