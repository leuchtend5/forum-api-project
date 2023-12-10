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
      const commentReplies = replies
        .filter((reply) => reply.comment_id === comment.id)
        .map(({ comment_id, ...replyWithoutCommentId }) => replyWithoutCommentId); // to hide comment_id
      return { ...comment, replies: commentReplies };
    });

    return { ...detailThread, comments: commentsWithReplies };
  }
}

module.exports = GetThreadUseCase;
