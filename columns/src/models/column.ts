import mongoose from 'mongoose';

interface ColumnAttrs {
  name: string;
  userid: string;
  boardid: string;
}

interface ColumnModel extends mongoose.Model<ColumnDoc> {
  build(attrs: ColumnAttrs): ColumnDoc;
}

interface ColumnDoc extends mongoose.Document {
  name: string;
  userid: string;
  boardid: string;
}

const ColumnSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userid: {
      type: String,
      required: true,
    },
    boardid: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

ColumnSchema.statics.build = (attrs: ColumnAttrs) => {
  return new Column(attrs);
};

export const Column = mongoose.model<ColumnDoc, ColumnModel>(
  'column',
  ColumnSchema
);
