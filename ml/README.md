# ml/
# AI Scheduling Prediction — Python ML service (separate from Node.js backend)
#
# This folder contains the Python prediction service that computes:
#   - consultation duration regression
#   - patient no-show probability classification
#
# It is called by services/aiService.js in the Node.js backend.
# Node.js owns all business decisions; Python only predicts.
