import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8083/api/v1';

// Types
export interface VendorType {
  PERMANENT: 'PERMANENT';
  TEMPORARY: 'TEMPORARY';
  SEASONAL: 'SEASONAL';
  EVENT_BASED: 'EVENT_BASED';
}

export interface VendorStatus {
  PENDING: 'PENDING';
  APPROVED: 'APPROVED';
  REJECTED: 'REJECTED';
  SUSPENDED: 'SUSPENDED';
  INACTIVE: 'INACTIVE';
}

export interface VendorRequest {
  name: string;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
  contactPerson?: string;
  businessLicense?: string;
  logoUrl?: string;
  operatingHours?: string;
  locationDescription?: string;
  floorIds?: string[];
  vendorType: string;
  temporaryStartDate?: string;
  temporaryEndDate?: string;
}

export interface VendorResponse {
  id: number;
  name: string;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
  contactPerson?: string;
  businessLicense?: string;
  logoUrl?: string;
  status: string;
  statusDisplayName: string;
  isActive: boolean;
  operatingHours?: string;
  locationDescription?: string;
  floorIds: string[];
  vendorType: string;
  vendorTypeDisplayName: string;
  temporaryStartDate?: string;
  temporaryEndDate?: string;
  averageRating: number;
  totalReviews: number;
  totalMenuItems: number;
  isCurrentlyActive: boolean;
  isTemporary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VendorStatusUpdateRequest {
  status: string;
  reason?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    pageSize: number;
    pageNumber: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

class VendorService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/vendors`;
  }

  // Get auth headers
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Create a new vendor
  async createVendor(vendorRequest: VendorRequest): Promise<VendorResponse> {
    try {
      console.log('Sending vendor creation request:', vendorRequest);
      console.log('Headers:', this.getAuthHeaders());
      console.log('URL:', this.baseURL);
      
      const response = await axios.post<ApiResponse<VendorResponse>>(
        this.baseURL,
        vendorRequest,
        { headers: this.getAuthHeaders() }
      );
      
      console.log('Vendor creation response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Vendor creation error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      // Enhanced error message extraction
      let errorMessage = 'Failed to create vendor';
      
      if (error.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied - You need ADMIN or MANAGER role to create vendors';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.data) {
        errorMessage = error.response.data.data;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  // Get vendor by ID
  async getVendorById(id: number): Promise<VendorResponse> {
    try {
      const response = await axios.get<ApiResponse<VendorResponse>>(
        `${this.baseURL}/${id}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch vendor');
    }
  }

  // Get all vendors with pagination
  async getAllVendors(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'name',
    sortDir: string = 'asc'
  ): Promise<PaginatedResponse<VendorResponse>> {
    try {
      const response = await axios.get<ApiResponse<PaginatedResponse<VendorResponse>>>(
        this.baseURL,
        {
          params: { page, size, sortBy, sortDir },
          headers: this.getAuthHeaders(),
        }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch vendors');
    }
  }

  // Get vendors by status
  async getVendorsByStatus(
    status: string,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<VendorResponse>> {
    try {
      const response = await axios.get<ApiResponse<PaginatedResponse<VendorResponse>>>(
        `${this.baseURL}/status/${status}`,
        {
          params: { page, size },
          headers: this.getAuthHeaders(),
        }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch vendors by status');
    }
  }

  // Get currently active vendors
  async getCurrentlyActiveVendors(
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<VendorResponse>> {
    try {
      const response = await axios.get<ApiResponse<PaginatedResponse<VendorResponse>>>(
        `${this.baseURL}/active`,
        {
          params: { page, size },
          headers: this.getAuthHeaders(),
        }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch active vendors');
    }
  }

  // Get vendors by type
  async getVendorsByType(
    type: string,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<VendorResponse>> {
    try {
      const response = await axios.get<ApiResponse<PaginatedResponse<VendorResponse>>>(
        `${this.baseURL}/type/${type}`,
        {
          params: { page, size },
          headers: this.getAuthHeaders(),
        }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch vendors by type');
    }
  }

  // Get vendors by floor
  async getVendorsByFloor(floorId: string, activeOnly: boolean = true): Promise<VendorResponse[]> {
    try {
      const response = await axios.get<ApiResponse<VendorResponse[]>>(
        `${this.baseURL}/floor/${floorId}`,
        {
          params: { activeOnly },
          headers: this.getAuthHeaders(),
        }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch vendors by floor');
    }
  }

  // Search vendors
  async searchVendors(
    query: string,
    activeOnly: boolean = true,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<VendorResponse>> {
    try {
      const response = await axios.get<ApiResponse<PaginatedResponse<VendorResponse>>>(
        `${this.baseURL}/search`,
        {
          params: { q: query, activeOnly, page, size },
          headers: this.getAuthHeaders(),
        }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to search vendors');
    }
  }

  // Update vendor
  async updateVendor(id: number, vendorRequest: VendorRequest): Promise<VendorResponse> {
    try {
      const response = await axios.put<ApiResponse<VendorResponse>>(
        `${this.baseURL}/${id}`,
        vendorRequest,
        { headers: this.getAuthHeaders() }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update vendor');
    }
  }

  // Update vendor status
  async updateVendorStatus(
    id: number,
    statusRequest: VendorStatusUpdateRequest
  ): Promise<VendorResponse> {
    try {
      const response = await axios.patch<ApiResponse<VendorResponse>>(
        `${this.baseURL}/${id}/status`,
        statusRequest,
        { headers: this.getAuthHeaders() }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update vendor status');
    }
  }

  // Toggle vendor active status
  async toggleVendorActiveStatus(id: number): Promise<VendorResponse> {
    try {
      const response = await axios.patch<ApiResponse<VendorResponse>>(
        `${this.baseURL}/${id}/toggle-active`,
        {},
        { headers: this.getAuthHeaders() }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to toggle vendor status');
    }
  }

  // Delete vendor
  async deleteVendor(id: number): Promise<void> {
    try {
      await axios.delete<ApiResponse<void>>(
        `${this.baseURL}/${id}`,
        { headers: this.getAuthHeaders() }
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete vendor');
    }
  }

  // Get pending approval vendors
  async getPendingApprovalVendors(
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<VendorResponse>> {
    try {
      const response = await axios.get<ApiResponse<PaginatedResponse<VendorResponse>>>(
        `${this.baseURL}/pending-approval`,
        {
          params: { page, size },
          headers: this.getAuthHeaders(),
        }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch pending vendors');
    }
  }

  // Get high-rated vendors
  async getHighRatedVendors(
    minRating: number = 4.0,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<VendorResponse>> {
    try {
      const response = await axios.get<ApiResponse<PaginatedResponse<VendorResponse>>>(
        `${this.baseURL}/high-rated`,
        {
          params: { minRating, page, size },
          headers: this.getAuthHeaders(),
        }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch high-rated vendors');
    }
  }

  // Get vendor statistics
  async getVendorStatistics(): Promise<any> {
    try {
      const response = await axios.get<ApiResponse<any>>(
        `${this.baseURL}/statistics`,
        { headers: this.getAuthHeaders() }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch vendor statistics');
    }
  }

  // Update vendor rating
  async updateVendorRating(id: number, rating: number): Promise<VendorResponse> {
    try {
      const response = await axios.patch<ApiResponse<VendorResponse>>(
        `${this.baseURL}/${id}/rating`,
        null,
        {
          params: { rating },
          headers: this.getAuthHeaders(),
        }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update vendor rating');
    }
  }

  // Get vendor types
  async getVendorTypes(): Promise<string[]> {
    try {
      const response = await axios.get<ApiResponse<string[]>>(
        `${this.baseURL}/types`,
        { headers: this.getAuthHeaders() }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch vendor types');
    }
  }

  // Get vendor statuses
  async getVendorStatuses(): Promise<string[]> {
    try {
      const response = await axios.get<ApiResponse<string[]>>(
        `${this.baseURL}/statuses`,
        { headers: this.getAuthHeaders() }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch vendor statuses');
    }
  }
}

const vendorService = new VendorService();
export default vendorService; 