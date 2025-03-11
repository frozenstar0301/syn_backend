export interface User {
    id: string;
    email: string;
    full_name: string | null;
    created_at: string;
    updated_at: string;
    is_verified: boolean;
}

export interface CreateUserDto {
    email: string;
    password: string;
    full_name?: string;
}

export interface LoginDto {
    email: string;
    password: string;
}
