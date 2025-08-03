package com.atomix.cafeteria.dto;

public class ApiResponse<T> {
    private Boolean success;
    private String message;
    private T data;

    // Constructors
    public ApiResponse(Boolean success, String message) {
        this.success = success;
        this.message = message;
        this.data = null;
    }
    
    public ApiResponse(String message, T data) {
        this.success = data != null;
        this.message = message;
        this.data = data;
    }
    
    public ApiResponse(Boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    // Static factory methods for convenience
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }
    
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null);
    }
    
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }
    
    public static <T> ApiResponse<T> error(String message, T data) {
        return new ApiResponse<>(false, message, data);
    }

    // Getters and Setters
    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
    
    public T getData() {
        return data;
    }
    
    public void setData(T data) {
        this.data = data;
    }
} 