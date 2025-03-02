import axiosPrivate from "../api/axios";

const useApiService = () => {

    const handleResponse = (response) => {
        if (response.status >= 200 && response.status < 300) {
            return { success: true, data: response.data };
        }
        
        const firstKey = Object.keys(response.data.error || {})[0];
        const firstErrorMessages = response.data.error?.[firstKey];
        const firstErrorMessage = Array.isArray(firstErrorMessages)
            ? `${firstErrorMessages[0]}`
            : `${firstErrorMessages}`;

        return {
            success: false,
            error: {
                message: "Unexpected response status.",
                status: response.status,
                details: firstErrorMessage || null,
            },
        };
    };

    const handleError = (error) => {
        if (error.response) {
            const status = error.response.status;
            if (status >= 500) {
                return {
                    success: false,
                    error: {
                        message: "Internal server error. Please try again later.",
                        status,
                    },
                };
            }
            
            const firstKey = Object.keys(error.response.data.error || {})[0];
            const firstErrorMessages = error.response.data.error?.[firstKey];
            const firstErrorMessage = Array.isArray(firstErrorMessages)
                ? `${firstErrorMessages[0]}`
                : `${firstErrorMessages}`;

            return {
                success: false,
                error: {
                    message: "Request failed.",
                    status,
                    details: firstErrorMessage || null,
                },
            };
        } else if (error.request) {
            return {
                success: false,
                error: {
                    message: "No response from the server. Please check your internet connection.",
                },
            };
        } else {
            return {
                success: false,
                error: {
                    message: "Unexpected error occurred.",
                    details: error.message,
                },
            };
        }
    };

    const get = async (url, config = {}) => {
        try {
            const response = await axiosPrivate.get(url, config);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    };

    const post = async (url, data, config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true }) => {
        try {
            const response = await axiosPrivate.post(url, JSON.stringify(data), config);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    };

    return { get, post };
};

export default useApiService;
