export interface ImageItem {
    id: string;
    url: string;
    name?: string;
    created_at?: string;
}

export interface FontItem {
    id: string;
    url: string;
    name: string;
    created_at?: string;
}

export interface Screen {
    id: string;
    background_image_id: string | null;
    button_image_id: string | null;
    font_id: string | null;
    created_at?: string;
    updated_at?: string;
}
