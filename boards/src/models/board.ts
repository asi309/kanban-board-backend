import mongoose from 'mongoose';

interface BoardAttrs {
  name: string;
  userId: string;
  tasks: [];
}

interface BoardModel extends mongoose.Model<BoardDoc> {
  build(attrs: BoardAttrs): BoardDoc;
}

interface BoardDoc extends mongoose.Document {
  name: string;
  userId: string;
  tasks: [];
}

const BoardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'task' }],
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

// UserSchema.pre('save', async function (done) {
//   if (this.isModified('password')) {
//     const hashed = await Password.toHash(this.get('password'));
//     this.set('password', hashed);
//   }
//   done();
// });

export const Board = mongoose.model<BoardDoc, BoardModel>('board', BoardSchema);
