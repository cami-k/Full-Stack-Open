require('dotenv').config()
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const name = process.argv[3]
const number = process.argv[4]

const entrySchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Entry = mongoose.model('Entry', entrySchema)

if (name && number) {
  
  const entry = new Entry({
    name: name,
    number: number,
  })

  entry.save().then(result => {
    console.log(`Added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })

} else {
  console.log('phonebook:')
  Entry.find({}).then(result => {
    result.forEach(entry => {
      console.log(`${entry.name} ${entry.number}`)
    })
  mongoose.connection.close()
  })
}



