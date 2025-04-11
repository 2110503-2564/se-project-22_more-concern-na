// interface.ts

// ---------- Shared Types ----------
interface GenericResponse {
    success: boolean;
    msg ?: string
}

interface RoomAvailability {
    type: string;
    remainCount: number;
}

interface SelectedRoom {
    type: string;
    count: number;
}

// ---------- GET /hotels/:id/reviews ----------
interface HotelReviewsQuery {
    selfPage: number;
    selfPageSize: number;
    otherPage: number;
    otherPageSize: number;
}

interface ReviewPagination {
    prev?: number;
    next?: number;
    count: number;
}

interface Review {
    userName: string;
    picture: string;
    stayMonth: Date;
    stayRoom: string;
    title: string;
    rating: number;
    text?: string;
    replyText?: string;
}

interface ReviewResponseSection {
    pagination: ReviewPagination;
    data: Review[];
}

interface HotelReviewsResponse extends GenericResponse {
    self: ReviewResponseSection;
    other: ReviewResponseSection;
}

// ---------- GET /hotels/:id/available ----------
interface HotelAvailabilityResponse extends GenericResponse {
    rooms: RoomAvailability[];
}

// ---------- POST /bookings ----------
interface BookingRequest {
    hotel?: string;
    user?: string;
    price: number;
    startDate: Date;
    endDate: Date;
    rooms: SelectedRoom[];
}

//TODO-Notyet
interface CreateBookingResponse extends GenericResponse{
    redirectUrl: string; // to user’s manage booking page
}

// ---------- PUT /reviews/:id ----------
interface UpdateReviewBody {
    title?: string;
    rating?: number;
    text?: string;
}



// ---------- POST /reports ----------
interface CreateReportBody {
    review: string;
    reportReason: string;
}


// ---------- Shared ----------
// TODO-NOTYET
interface BookingSummary {
    active: number;
    upcoming: number;
    past: number;
}

// ---------- GET /user ----------
//TODO-NOTYET
interface GetUserResponse extends GenericResponse{
    picture?: string;
    name: string;
    email: string;
    tel: string;
    point: number;
    bookings: BookingSummary;
}

// ---------- POST /user ----------
interface CreateUserBody {
    name?: string;
    picture?: string;
    tel?: string;
    password?: string;
}

interface CreateUserResponse extends GenericResponse{
    picture?: string;
    name?: string;
    tel?: string;
    token?: string;
}


// ---------- Register ----------
interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    tel: string;
}

// ---------- Login ----------
interface LoginRequest {
    email: string;
    password: string;
}

// ---------- Auth Response ----------
type UserRole = 'guest' | 'admin' | 'user' | 'hotelManager'; // Adjust as needed

interface AuthResponse extends GenericResponse{
    token: string;
    data: {
        name: string;
        picture: string;
        role: UserRole;
        point: number;
    }
}

// ---------- Bookings Request ----------
interface BookingsRequest {
    hotel: string;
    user: string;
    status?: string;
    price: number;
    startDate: Date;
    endDate: Date;
    rooms: {
        roomType: string;
        count: number;
    }[];
}


// ---------- Hotels Request ----------
interface HotelRoom {
    _id?: string;
    roomType: string;
    picture?: string;
    capacity: number;
    maxCount: number;
    price: number;
}

interface IHotel {
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
interface HotelResponse extends GenericResponse{
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
interface BookingQuery {
    activePage?: number;
    activePageSize?: number;
    upcomingPage?: number;
    upcomingPageSize?: number;
    pastPage?: number;
    pastPageSize?: number;
}

interface BookingPagination {
    prev?: number;
    next?: number;
    count: number; // count data that query after offset
}

interface Booking {
    hotelName: string;
    startDate: Date;
    endDate: Date;
    address: string;
}

interface BookingData {
    pagination: BookingPagination;
    data: Booking[];
}

interface BookingResponse extends GenericResponse{
    active: BookingData;
    upcoming: BookingData;
    past: BookingData;
}
