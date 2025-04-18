// ---------- Shared Types ----------
export type UserRole = 'admin' | 'user' | 'hotelManager';
export interface GenericResponse {
    success: boolean;
    msg ?: string
}

export interface Pagination {
    pagination: {
        next?: {
            page: number;
            limit: number;
        },
        prev?: {
            page: number;
            limit: number;
        }
    }
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
}

export interface HotelResponse extends GenericResponse, Pagination {
    total: number;
    data: IHotel[]
}
export interface HotelAvailabilityResponse extends GenericResponse {
    rooms: RoomAvailability[];
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
export interface AuthResponse extends GenericResponse{
    token: string;
    data: {
        name: string;
        picture: string;
        role: UserRole;
        point: number;
    }
}

//-------ReviewSchema Interface------
export interface IReview {
    _id: string;
    booking?: string;
    rating?: number;
    reply?: string;
    title?: string;
    text?: string;
    createdAt: string;
  }

//-------ReportSchema Interface------
export interface IReport {
    _id: string;
    review: string;
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
    user: string;
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

export interface Review {
    userName: string;
    picture: string;
    stayMonth: string;
    stayRoom: string;
    title: string;
    rating: number;
    text?: string;
    replyText?: string;
}

export interface ReviewResponseSection {
    pagination: ReviewPagination;
    data: Review[];
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

export interface CreateUserResponse extends GenericResponse{
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
export interface BookingResponse extends GenericResponse{
    total: number;
    bookings?:PBooking[];
    booking?:PBooking;
}