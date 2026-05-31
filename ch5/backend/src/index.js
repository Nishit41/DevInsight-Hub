import { app } from './app.js'
import dotenv from 'dotenv'
import { initDatabase } from './db/init.js'
dotenv.config()
const PORT = process.env.PORT || 8080

// Start listening immediately so GCP Cloud Run's port health check passes successfully
app.listen(PORT, () => {
  console.info(`express server running on http://localhost:${PORT}`)
})

// Initialize the database connection asynchronously
try {
  await initDatabase()
} catch (err) {
  console.error('error connecting to database:', err)
}