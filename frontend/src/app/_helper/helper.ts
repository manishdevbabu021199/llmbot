import { APIConstants } from "../api.constants";
import apiClient from "@/components/utility/api/apiClient";

export class Helper{
    async funValidateToken() {
        try {
            let token = await apiClient.get(APIConstants.VALIDATE_TOKEN)
            return token
        }
        catch {
            return null;
        }
    }
    toSentenceCase(str: string) {
        if (!str) return "";
        str = str.trim();
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
}