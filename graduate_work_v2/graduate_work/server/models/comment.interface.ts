import { Document, Schema } from "mongoose";

export interface CommentI extends Document {
    id : Schema.Types.ObjectId;
    username: string;
    content: string;
    media: `movie` | `tv`;
    mediaId: Number;
    parentId: Schema.Types.ObjectId | null;
    createdAt : Date;
    hasNestedComments: boolean;
};

