// interface.ts

// ---------- Shared Types ----------
export interface GenericResponse {
    success: boolean;
    msg ?: string
}

export interface RoomAvailability {
    type: string;
    remainCount: number;
}

export interface SelectedRoom {
    roomType: string;
    count: number;
}

// ---------- GET /hotels/:id/reviews ----------
export interface HotelReviewsQuery {
    selfPage: number;
    selfPageSize: number;
    otherPage: number;
    otherPageSize: number;
}

export interface ReviewPagination {
    prev?: number;
    next?: number;
    count: number;
}

export interface Review {
    userName: string;
    picture: string;
    stayMonth: Date;
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

// ---------- GET /hotels/:id/available ----------
export interface HotelAvailabilityResponse extends GenericResponse {
    rooms: RoomAvailability[];
}

// ---------- POST /bookings ----------
export interface BookingRequest {
    hotel?: string;
    user?: string;
    price: number;
    startDate: string;
    endDate: string;
    rooms: SelectedRoom[];
}

//TODO-Notyet
export interface CreateBookingResponse extends GenericResponse{
    redirectUrl: string; // to user’s manage booking page
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


// ---------- Shared ----------
// TODO-NOTYET
export interface BookingSummary {
    active: number;
    upcoming: number;
    past: number;
}

// ---------- GET /user ----------
//TODO-NOTYET
export interface GetUserResponse extends GenericResponse{
    picture?: string;
    name: string;
    email: string;
    tel: string;
    point: number;
    bookings: BookingSummary;
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


// ---------- Register ----------
export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    tel: string;
}

// ---------- Login ----------
export interface LoginRequest {
    email: string;
    password: string;
}

// ---------- Auth Response ----------
export type UserRole = 'guest' | 'admin' | 'user' | 'hotelManager'; // Adjust as needed

export interface AuthResponse extends GenericResponse{
    token: string;
    data: {
        name: string;
        picture: string;
        role: UserRole;
        point: number;
    }
}

// ---------- Bookings Request ----------
export interface BookingsRequest {
    hotel: string;
    user: string;
    status?: string;
    price: number;
    startDate: string;
    endDate: string;
    rooms: {
        roomType: string;
        count: number;
    }[];
}


// ---------- Hotels Request ----------
export interface HotelRoom {
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
    rooms: HotelRoom[];
    ratingSum: number;
    ratingCount: number;
}
//---------GET /hotels-----------
export interface HotelResponse extends GenericResponse{
    count: number;
    pagination: {
        next?: {
            page: number;
            limit: number;
        },
        prev?: {
            page: number;
            limit: number;
        }
    },
    data: IHotel[]
}

//---------GET /bookings-----------
export interface BookingQuery {
    activePage?: number;
    activePageSize?: number;
    upcomingPage?: number;
    upcomingPageSize?: number;
    pastPage?: number;
    pastPageSize?: number;
}

export interface BookingPagination {
    prev?: number;
    next?: number;
    count: number; // count data that query after offset
}

export interface Booking {
    hotelName: string;
    startDate: Date;
    endDate: Date;
    address: string;
}

export interface BookingData {
    pagination: BookingPagination;
    data: Booking[];
}

export interface BookingResponse extends GenericResponse{
    active: BookingData;
    upcoming: BookingData;
    past: BookingData;
}
