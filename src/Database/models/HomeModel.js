import mongoose from 'mongoose'

// Esquema para los recursos de lactancia
const lactationResourceSchema = new mongoose.Schema({
  title: {
    es: {
      type: String,
      required: true,
    },
    gl: {
      type: String,
      required: true,
    },
  },
  link: {
    type: String,
    required: true,
  },
})

// Esquema para los recursos de embarazo
const pregnancyResourceSchema = new mongoose.Schema({
  title: {
    es: {
      type: String,
      required: true,
    },
    gl: {
      type: String,
      required: true,
    },
  },
  link: {
    type: String,
    required: true,
  },
})

// Esquema para los recursos de crianza
const parentingResourceSchema = new mongoose.Schema({
  title: {
    es: {
      type: String,
      required: true,
    },
    gl: {
      type: String,
      required: true,
    },
  },
  link: {
    type: String,
    required: true,
  },
})

// Esquema para los blogs de alimentación
const nutritionBlogSchema = new mongoose.Schema({
  title: {
    es: {
      type: String,
      required: true,
    },
    gl: {
      type: String,
      required: true,
    },
  },
  link: {
    type: String,
    required: true,
  },
})

// Esquema para los blogs de hemeroteca
const archiveBlogSchema = new mongoose.Schema({
  title: {
    es: {
      type: String,
      required: true,
    },
    gl: {
      type: String,
      required: true,
    },
  },
  link: {
    type: String,
    required: true,
  },
})

// Esquema principal
const homeSchema = new mongoose.Schema({
  home: {
    sectionText: {
      es: {
        type: String,
        required: true,
      },
      gl: {
        type: String,
        required: true,
      },
    },
    imageHome: {
      type: String,
      required: true,
    },
    titleHome: {
      es: {
        type: String,
        required: true,
      },
      gl: {
        type: String,
        required: true,
      },
    },
  },
  generalSettings: {
    logo: {
      type: String,
      required: true,
    },
    linkInstagram: {
      type: String,
      required: true,
    },
    linkFacebook: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  library: {
    lactationResources: [lactationResourceSchema],
    lactationBooks: {
      type: String,
      required: true,
    },
    pregnancyResources: [pregnancyResourceSchema],
    pregnancyBooks: {
      type: String,
      required: true,
    },
    parentingBooks: {
      type: String,
      required: true,
    },
    parentingResources: [parentingResourceSchema],
    nutritionBlogs: [nutritionBlogSchema],
    nutritionBooks: {
      type: String,
      required: true,
    },
    archiveBlogs: [archiveBlogSchema],
  },
})

const HomeModel = mongoose.model('Home', homeSchema)

export default HomeModel
