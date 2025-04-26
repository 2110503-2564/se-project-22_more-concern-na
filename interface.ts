// ---------- Shared Types ----------
export type UserRole = 'admin' | 'user' | 'hotelManager';
export interface GenericResponse {
  success: boolean;
  msg?: string;
}

export interface Pagination {
  pagination: {
    next?: {
      page: number;
      limit: number;
    };
    prev?: {
      page: number;
      limit: number;
    };
  };
}

//-----HotelSchema Interface-----
export interface RoomAvailability {
  roomType: string;
  remainCount: number;
}
export interface Rooms {
  _id?: string;
  roomType: string;
  picture?: string;
  capacity: number;
  maxCount: number;
  price: number;
}
export interface IHotel {
  _id?: string;
  name: string;
  description?: string;
  picture?: string;
  buildingNumber: string;
  street: string;
  district: string;
  province: string;
  postalCode: string;
  tel: string;
  rooms: Rooms[];
  ratingSum: number;
  ratingCount: number;
  rating?:number;
}

export interface HotelResponse extends GenericResponse, Pagination {
  total: number;
  data: IHotel[];
}
export interface HotelAvailabilityResponse extends GenericResponse {
  rooms: RoomAvailability[];
}

export interface AllReportResponse extends GenericResponse {
  count: number;
  reports: {
    reportReason: string;
    data: {
      hotel: string;
      report: IReport[];
    }[];
  }[];
}

//------UserSchema Interface-----
export interface UserRedeemable {
  redeemableId: string;
  count: number;
}
export interface IUser {
  _id: string;
  id?: string;
  name: string;
  tel: string;
  picture?: string;
  email: string;
  password: string;
  role: string;
  hotel: string;
  point: number;
  inventory: UserRedeemable[];
  createdAt: string;
}

export interface UserResponse extends GenericResponse {
  total: number;
  data: IUser[];
}

export interface LoginRequest {
  email: string;
  password: string;
}
export interface GetMeResponse extends GenericResponse {
  data: IUser;
}
export interface AuthResponse extends GenericResponse {
  token: string;
  data: {
    name: string;
    picture: string;
    role: UserRole;
    point: number;
  };
}

//-------ReviewSchema Interface------
export interface IReview {
  _id: string;
  booking?: IBooking;
  rating?: number;
  reply?: IReply;
  title?: string;
  text?: string;
  createdAt: string;
}

export interface IReply {
  _id: string;
  title: string;
  text: string;
}

//-------ReportSchema Interface------
export interface IReport {
  _id: string;
  review: IReview;
  reportDate: string;
  reportReason: string;
  isIgnore: boolean;
}

//-------RedeemableSchema Interface------
export interface IRedeemable {
  _id: string;
  type: string;
  name: string;
  description?: string;
  picture?: string;
  pointUse: number;
  discount?: number;
  remainCount: number;
}

//------BookingSchema Interface-----
export interface BookingType {
  roomType: string;
  count: number;
}
export interface IBooking {
  _id: string;
  user: IUser;
  hotel: string;
  status: string;
  price: number;
  startDate: string;
  endDate: string;
  rooms: BookingType[];
  createdAt: string;
}

// ---------- GET /hotels/:id/reviews ----------
export interface HotelReviewsQuery {
  selfPage: number;
  selfPageSize: number;
  otherPage: number;
  otherPageSize: number;
}

export interface ReviewPagination {
  count: number;
  prev?: number;
  next?: number;
}

export interface ReviewResponseSection {
  pagination: ReviewPagination;
  data: IReview[];
}

export interface HotelReviewsResponse extends GenericResponse {
  self: ReviewResponseSection;
  other: ReviewResponseSection;
}

// ---------- PUT /reviews/:id ----------
export interface UpdateReviewBody {
  title?: string;
  rating?: number;
  text?: string;
}

// ---------- POST /reports ----------
export interface CreateReportBody {
  review: string;
  reportReason: string;
}

// ---------- POST /user ----------
export interface CreateUserBody {
  name?: string;
  picture?: string;
  tel?: string;
  password?: string;
}

export interface CreateUserResponse extends GenericResponse {
  picture?: string;
  name?: string;
  tel?: string;
  token?: string;
}

// ---------- Bookings Request ----------
export interface BookingsRequest {
  hotel: string;
  status?: string;
  price: number;
  startDate: string;
  endDate: string;
  rooms: {
    roomType: string;
    count: number;
  }[];
}

//---------GET /bookings-----------
export interface PBooking {
  _id: string;
  user: IUser;
  hotel: IHotel;
  status: string;
  price: number;
  startDate: string;
  endDate: string;
  rooms: BookingType[];
  createdAt: string;
}
export interface BookingResponse extends GenericResponse {
  total: number;
  bookings?: PBooking[];
  booking?: PBooking;
}

/////////////////////////////////// SPRINT 2 ////////////////////////////////////////////

//-------GET /redeemables/gifts--------

export interface RedeemableGiftsQuery {
  page: number;
  pageSize: number;
}

export interface RedeemableGiftsData {
  id: string;
  name: string;
  picture?: string;
  point: number;
  remain: number;
}

export interface RedeemableGiftsResponse extends GenericResponse, Pagination {
  data: RedeemableGiftsData[];
}

//--------GET /redeemables/gifts/:id-----------

export interface RedeemableGiftResponse extends GenericResponse {
  id: string;
  name: string;
  description?: string;
  point: number;
  picture?: string;
  remain: number;
}

//--------GET /redeemables/coupons--------

export interface RedeemableCouponsQuery {
  page: number;
  pageSize: number;
}

export interface RedeemableCouponsData {
  id: string;
  name: string;
  point: number;
  discount: number;
  expire: string;
  remain: number;
}

export interface RedeemableCouponsResponse extends GenericResponse, Pagination {
  data: RedeemableCouponsData[];
}

//------POST /redeemables/creation (for admin to add redeemables)-----

export type RedeemableType = 'gift' | 'coupon';

export interface CreateRedeemableBody {
  type: RedeemableType;
  name: string;
  point: number;
  remain: number;
  picture?: string;
  description?: string;
  discount?: number;
  expire?: string;
}

//-----POST /redeemables/redemption (for user to redeem)----

export interface CreateRedeemableRedemptionBody {
  id: string;
}
export interface CreateRedeemableRedemptionResponse extends GenericResponse {
  remain: number;
}

//------GET /inventory/gifts-----

export interface InventoryGiftsQuery {
  page: number;
  pageSize: number;
}

export interface InventoryGiftsData {
  id: string;
  name: string;
  picture?: string;
  count: number;
}

export interface InventoryGiftsResponse extends GenericResponse, Pagination {
  total: number;
  data: InventoryGiftsData[];
}

//------GET /inventory/coupons-----

export interface InventoryCouponsQuery {
  page: number;
  pageSize: number;
}

export interface InventoryCouponsData {
  id: string;
  name: string;
  discount: number;
  expire: string;
  count: number;
}

export interface InventoryCouponsResponse extends GenericResponse, Pagination {
  total: number;
  data: InventoryCouponsData[];
}

//------Admin Sprint2---------//

//-----GET /redeemables/price-to-point-------

export interface RedeemablePriceToPointResponse extends GenericResponse {
  priceToPoint: number;
}

//-----POST /redeemables/price-to-point------

export interface CreateRedeemablePriceToPointBody {
  priceToPoint: number;
}

export interface CreateRedeemablePriceToPointResponse extends GenericResponse {
  priceToPoint: number;
}

//-----GET /users/points-----

export interface UsersPointsQuery {
  page: number;
  pageSize: number;
}

export interface UsersPointsData {
  id: string;
  name: string;
  email: string;
  point: number;
}

export interface UsersPointsResponse extends GenericResponse, Pagination {
  data: UsersPointsData[];
}

//------PUT /users/points/:id------

export interface UpdateUserPointBody {
  point: number;
}

export interface UpdateUserPointResponse extends GenericResponse {
  point: number;
}
