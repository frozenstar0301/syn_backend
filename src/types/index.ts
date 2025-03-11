export interface ImageItem {
    id: string;
    url: string;
    name?: string;
    created_at?: any;
}

export interface FontItem {
    id: string;
    url: string;
    name: string;
    created_at?: any;
}

export interface Screen {
    id: string;
    background_image_id: string | null;
    button_image_id: string | null;
    font_id: string | null;
    created_at?: any;
    updated_at?: any;
}

export interface SignUpScreen {
    id: string;
    background_image_id: string | null;
    button_image_id: string | null;
    font_id: string | null;
    email_border_color: string | null;
    email_image_id: string | null;
    created_at?: any;
    updated_at?: any;
}