const mongoose = require("mongoose");

const { Schema } = mongoose;

const articleSchema = new Schema({
  title: {
    type: String,
    required: [true, "Article Name is required"]
  },
  url: {
    type: String,
    unique:true,
    required: [true, "Article url is required"]
  },
  photo:{
    type:String,
    required:true,
  },
  content:[
    {
        blocks:[
            {
                data:{
                        type:Object,
                        required:true
                },
                id:{
                    type:String,
                    required:true
                },
                type:{
                    type:String,
                    required:true
                }
            }
        ],
        version:{
            type:String,
            required:true,
        },
        time:{
            type:Number,
            required:true
        }
    },
],
  dateCreated:{
    type:Date,
    default:Date.now,
  },
  dateUpdated:{
    type:Date,
    default:Date.now,
  }
});

module.exports = new mongoose.model("article", articleSchema);
