import express from "express"
import "dotenv/config"
import { Router as AuthController } from "./auth/auth.controller";
import { adminRouter } from "./admin/admin.controller";
import { middleware_admin, middleware_allrole, middleware_mentor } from "./middleware";
import { Router as UserController } from "./user/user.controller";
import { Router as MentorController } from "./mentor/mentor.controller";
import { Router as DefaultRouter } from "./default/default.controller";
import { Router as MentorClassController } from "./mentor/class/mentor.class.controller";
import cors from "cors"

import jsonSwager from "../docs/swagger.json";
import { swagger_static } from "../docs/swagger.static";
import { homepage } from "./utils/hompage.status";
import {logger} from "./utils/prisma";
import { ClassCategoryRouter } from "./mentor/class/mentor.class.category.controller";
import { ClassContent } from "./mentor/class/content/mentor.class.content.controller";
import { UserClassController } from "./user/class/user.class.controller";

const app = express();
const app_port = process.env.APP_PORT || 3000
jsonSwager.servers[0].url = process.env.APP_URL!

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE","PUT"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json())

app.get("/", homepage)
app.get("/docs/api/option.json", (_, res) => { res.send(jsonSwager) })
app.get("/docs", (_, res) => { res.send(swagger_static("/docs/api/option.json")) })

app.use("/auth", AuthController)
app.use("/user", middleware_allrole, UserController)
app.use("/user/class", middleware_allrole, UserClassController)
app.use("/admin", middleware_admin, adminRouter)
app.use("/mentor", middleware_mentor, MentorController)
app.use("/mentor/class", middleware_mentor,MentorClassController )
app.use("/mentor/class/category", middleware_mentor, ClassCategoryRouter)
app.use("/mentor/class/content", middleware_mentor, ClassContent)
app.use("/default", middleware_allrole, DefaultRouter)

app.listen(app_port, () => {
    logger.info("running on port " + app_port)
})

export default app