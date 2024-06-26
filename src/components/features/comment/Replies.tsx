"use client";

import Loading from "@/components/shared/Loading";
// import TransLink from "@/components/shared/TransLink";
import CommentReplyContextProvider, {
  useCommentReply,
} from "@/contexts/CommentReplyContext";
import { getMentionedUserIds } from "@/utils/editor";
import { useUser } from "@/contexts/AuthContext";
import { Editor as EditorType } from "@tiptap/react";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import CommentComponent from "./Comment";
import Editor from "./Editor";
import useComments from "@/hooks/useComments";
import useCreateComment from "@/hooks/useCreateComment";
import { useSession } from "next-auth/react";

interface CommentState {
  defaultContent?: string;
}

interface CommentsProps {
  parentId?: string;
  animeId: string;
  handleShowReplies: any;
}

const Replies: React.FC<CommentsProps> = ({
  parentId = null,
  animeId,
  handleShowReplies,
}) => {
  const [commentState, setCommentState] = useState<any>({});
  const commentReply = useCommentReply();
  const { data: session } = useSession();
  const replyRef = useRef<EditorType>(null);

  const { mutate: createComment, isLoading: createCommentLoading } =
    useCreateComment();

  useEffect(() => {
    if (!commentReply?.replyingTo) {
      setCommentState({ defaultContent: null });
    } else {
      setCommentState({
        defaultContent: `<span data-type="mention" data-id="${commentReply.replyingTo.user.id}" data-label="${commentReply.replyingTo.user.name}" contenteditable="false"></span><span>&nbsp</span>`,
      });
    }
  }, [commentReply?.replyingTo]);

  const handleEditorSubmit: any = (content: string) => {
    createComment({
      animeId,
      parentId,
      text: content,
    });

    setCommentState({ defaultContent: null });
    replyRef.current?.commands?.clearContent();
    commentReply?.setReplyingTo(null);
    handleShowReplies();
  };

  return (
    <div>
      <div className="mb-10">
        {session?.user && (
          <Editor
            ref={replyRef}
            placeholder={"Add a reply"}
            defaultContent={commentState.defaultContent}
            autofocus={!!commentReply?.replyingTo}
            onSubmit={handleEditorSubmit}
            isLoading={createCommentLoading}
          />
        )}
      </div>
    </div>
  );
};

export default Replies;
