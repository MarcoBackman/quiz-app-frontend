import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Define the API service class
class ApiService {
    constructor(baseURL = API_BASE_URL) {
        this.http = axios.create({
            baseURL,
            timeout: 10000,
            headers: { "Content-Type": "application/json" }
        });
    }

    // Method for GET requests
    getJcgSubjectCategories = async() => {
        try {
            const response = await this.http.get('/main/get-jcg-subject-categories', {});
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    //selectedQuizCategory.id : 1
    generateDbArchitectureQuiz = async(generateQuizDto) => {
        try {
            const response = await this.http.post('/quiz/generate-db-architecture', generateQuizDto);
            return response.data;
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    //selectedQuizCategory.id : 2
    generateDesignPatternQuiz = async(generateQuizDto) => {
        // The endpoint is /quiz/generate-design-pattern
        // And it's a POST request with the DTO in the body.
        try {
            const response = await this.http.post('/quiz/generate-design-pattern', generateQuizDto);
            return response.data;
        } catch (error) {
            this.handleError(error);
            return []; // Return empty array on error
        }
    }

    //selectedQuizCategory.id : 3
    generateSoftwareDiagramQuiz = async(generateQuizDto) => {
        try {
            const response = await this.http.post('/quiz/generate-software-diagram', generateQuizDto);
            return response.data;
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    //selectedQuizCategory.id : 4
    generateIntegrationTestQuiz = async(generateQuizDto) => {
        try {
            const response = await this.http.post('/quiz/generate-integration-test', generateQuizDto);
            return response.data;
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    //selectedQuizCategory.id : 5
    generateModuleCouplingCohesionQuiz = async(generateQuizDto) => {
        try {
            const response = await this.http.post('/quiz/generate-module-coupling-cohesion', generateQuizDto);
            return response.data;
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    //selectedQuizCategory.id : 6
    generateSoftwareDevelopmentModelQuiz = async(generateQuizDto) => {
        try {
            const response = await this.http.post('/quiz/generate-software-development-model', generateQuizDto);
            return response.data;
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    //selectedQuizCategory.id : 7
    generateTestingQuiz = async(generateQuizDto) => {
        try {
            const response = await this.http.post('/quiz/generate-testing', generateQuizDto);
            return response.data;
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    // Centralized error handler (can log issues or format error messages)
    handleError = (error) => {
        console.error("API Error:", error?.response?.data || error.message);
        throw error;
    }
}

export default new ApiService();