import { Router } from "express";
import catchAsyncError from "../middlewares/async-error-handler";
import restricted from "../middlewares/auth-middleware";
import { HouseController } from "../controllers/house";



const houseRouter: Router = Router();
const houseController = new HouseController()

houseRouter
.route('/')
.post(catchAsyncError(restricted), catchAsyncError(houseController.createHouse));

houseRouter
.route('/myhouses')
.get(catchAsyncError(restricted), catchAsyncError(houseController.getMyHouses));

houseRouter
.route('/:id(\\d+)')
.get(catchAsyncError(restricted), catchAsyncError(houseController.getHouseDetails))
.put(catchAsyncError(restricted), catchAsyncError(houseController.updateHouse))
.delete(catchAsyncError(restricted), catchAsyncError(houseController.deleteHouse));

houseRouter
.route('/add-house-member')
.get(catchAsyncError(restricted), catchAsyncError(houseController.addHouseMember));

houseRouter
.route('/house-member-requests/:requestId(\\d+)/action')
.get(catchAsyncError(restricted), catchAsyncError(houseController.approveOrDenyMemberRequest));

  
export default houseRouter
