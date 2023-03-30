import mongoose from 'mongoose';

interface TaskAttrs {
  title: string;
  description: string;
  userId: string;
  columnId?: string;
  parent?: string;
}

interface TaskModel extends mongoose.Model<TaskDoc> {
  build(attrs: TaskAttrs): TaskDoc;
}

interface TaskDoc extends mongoose.Document {
  title: string;
  description: string;
  userId: string;
  columnId?: string;
  parent?: string;
}

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    userId: {
      type: String,
      required: true,
    },
    columnId: String,
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'task' },
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
  return new Task(attrs);
};

export const Task = mongoose.model<TaskDoc, TaskModel>('task', TaskSchema);
