import mongoose from 'mongoose';

interface TaskAttrs {
  name: string;
  userId: string;
  tasks: [];
}

interface TaskModel extends mongoose.Model<TaskDoc> {
  build(attrs: TaskAttrs): TaskDoc;
}

interface TaskDoc extends mongoose.Document {
  name: string;
  userId: string;
  tasks: [];
}

const TaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
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

TaskSchema.statics.build = (attrs: TaskAttrs) => {
  return new Board(attrs);
};

export const Board = mongoose.model<TaskDoc, TaskModel>('task', TaskSchema);
