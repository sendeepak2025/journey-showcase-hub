const mongoose = require('mongoose');

const ActionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String } ,// optional
  type: { type: String } // optional
}, { _id: false });

const TouchpointSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  duration: { type: String, required: true },
  actions: [ActionSchema],
  compassTags:[String],
  comment: { type: String, }
}, { _id: false });

const StageSchema = new mongoose.Schema({
  name: { type: String, enum: ['awareness', 'consideration', 'quote'], required: true },
  description: { type: String, required: true },
  touchpoints: [TouchpointSchema]
}, { _id: false });

const PerformanceIndicatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true }
}, { _id: false });

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  npsScore: { type: Number, required: true },
  customerSentiment: { type: Number, required: true },
  keyInsight: { type: String, required: true },
  performanceIndicators: [PerformanceIndicatorSchema],
  stages: [StageSchema]
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
