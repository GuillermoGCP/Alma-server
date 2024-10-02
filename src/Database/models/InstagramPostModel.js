import mongoose from 'mongoose'

const { Schema } = mongoose

const InstagramPostSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    postNumber: {
        type: String || Number,
        required: true,
    },
})

const InstagramPostModel = mongoose.model('InstagramPost', InstagramPostSchema)

export default InstagramPostModel
