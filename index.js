const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

const names = ["Kyle Coberly"]
app.get("/", (request, response) => {
	response.json({ names })
})

const authMiddleware = (request, response, next) => {
	// Get an auth token from the request
	const token = request.get("Authorization")
	const isValid = validateToken(token)
	if (isValid) {
		const user = lookupUserFromDatabase(token)
		request.user = user
		next()
	} else {
		response.status(401).json({
			error: "Nice try, asshole"
		})
	}
}

app.put("/names", authMiddleware)
app.delete("/names", authMiddleware)

app.post("/names", (request, response) => {
	const name = request.body.name
	names.push(name)
	response.json({ name })
})

app.listen(4000, () => {
	console.log("Listening on 4000")
})
