import mongoose from 'mongoose';

interface BoardAttrs {
  name: string;
  userId: string;
  // tasks: [];
}

interface BoardModel extends mongoose.Model<BoardDoc> {
  build(attrs: BoardAttrs): BoardDoc;
}

interface BoardDoc extends mongoose.Document {
  name: string;
  userId: string;
  // tasks: [];
}

const BoardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    // tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'task' }],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

BoardSchema.statics.build = (attrs: BoardAttrs) => {
  return new Board(attrs);
};

export const Board = mongoose.model<BoardDoc, BoardModel>('board', BoardSchema);
