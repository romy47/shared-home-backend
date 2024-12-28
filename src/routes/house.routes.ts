import { Response, Router } from "express";
import IRequest from "../models/request";
import catchAsyncError from "../middlewares/async-error-handler";
import { createHouse, getHouseDetails, updateHouse } from "../controllers/house";
import restricted from "../middlewares/auth-middleware";



const houseRouter: Router = Router();


houseRouter
.route('/')
.post(catchAsyncError(restricted), catchAsyncError(createHouse));

houseRouter
.route('/:id')
.get(catchAsyncError(restricted), catchAsyncError(getHouseDetails))
.put(catchAsyncError(restricted), catchAsyncError(updateHouse));
  

  
export default houseRouter
