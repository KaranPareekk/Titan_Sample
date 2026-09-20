/**
 * TITAN OS Cloudinary Media Service
 * Provides direct client-to-cloud unsigned asset uploads and dynamic URL transformations.
 * Designed with a provider pattern to allow seamless fallback when Cloudinary is not configured.
 */

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
  created_at: string;
}

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'thumb' | 'scale' | 'fit' | 'crop';
  gravity?: 'face' | 'center' | 'auto';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'png' | 'jpg';
}

const CONFIG_STORAGE_KEY = 'titan_cloudinary_config_v1';

export const CloudinaryService = {
  /**
   * Retrieve active Cloudinary configuration.
   * Priority: localStorage custom configuration > environment variables.
   */
  getConfig(): CloudinaryConfig {
    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.cloudName && parsed.uploadPreset) {
          return {
            cloudName: parsed.cloudName.trim(),
            uploadPreset: parsed.uploadPreset.trim(),
          };
        }
      }
    } catch {
      // Ignore localStorage parse errors
    }

    const envCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
    const envUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

    return {
      cloudName: envCloudName.trim(),
      uploadPreset: envUploadPreset.trim(),
    };
  },

  /**
   * Save custom configuration to localStorage (useful for UI testing & demos)
   */
  saveConfig(config: CloudinaryConfig): void {
    if (!config.cloudName && !config.uploadPreset) {
      localStorage.removeItem(CONFIG_STORAGE_KEY);
    } else {
      localStorage.setItem(
        CONFIG_STORAGE_KEY,
        JSON.stringify({
          cloudName: config.cloudName.trim(),
          uploadPreset: config.uploadPreset.trim(),
        })
      );
    }
  },

  /**
   * Check if Cloudinary credentials are valid and non-empty
   */
  isConfigured(): boolean {
    const config = this.getConfig();
    return Boolean(config.cloudName && config.uploadPreset);
  },

  /**
   * Upload an image file or blob directly to Cloudinary using Unsigned Upload
   */
  async uploadImage(
    file: File | Blob,
    options?: { folder?: string; tags?: string[] }
  ): Promise<CloudinaryUploadResponse> {
    const config = this.getConfig();

    if (!config.cloudName || !config.uploadPreset) {
      throw new Error(
        'Cloudinary credentials missing. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env or configure in Profile settings.'
      );
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', config.uploadPreset);

    if (options?.folder) {
      formData.append('folder', options.folder);
    }
    if (options?.tags && options.tags.length > 0) {
      formData.append('tags', options.tags.join(','));
    }

    const endpoint = `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`;

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg =
        errorData.error?.message ||
        `Cloudinary upload failed with HTTP status ${response.status} (${response.statusText})`;
      throw new Error(errorMsg);
    }

    const result: CloudinaryUploadResponse = await response.json();
    return result;
  },

  /**
   * Generates a transformed, optimized Cloudinary CDN URL
   * Default: auto format (WebP/AVIF), auto compression, smart face cropping
   */
  getTransformedUrl(
    url: string,
    options: CloudinaryTransformOptions = {}
  ): string {
    if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
      return url;
    }

    const {
      width = 256,
      height = 256,
      crop = 'fill',
      gravity = 'face',
      quality = 'auto',
      format = 'auto',
    } = options;

    const transformSegments: string[] = [
      `c_${crop}`,
      `g_${gravity}`,
      `w_${width}`,
      `h_${height}`,
      `q_${quality}`,
      `f_${format}`,
    ];

    const transformation = transformSegments.join(',');

    // Insert transformation after "/upload/" in Cloudinary URLs
    if (url.includes('/upload/')) {
      // Check if already transformed to avoid duplicates
      if (url.includes('/upload/c_')) {
        return url.replace(/\/upload\/[^/]+\//, `/upload/${transformation}/`);
      }
      return url.replace('/upload/', `/upload/${transformation}/`);
    }

    return url;
  },

  /**
   * Build a direct CDN URL from a Cloudinary public ID or media path
   * e.g. "avatar_123" -> "https://res.cloudinary.com/<cloudName>/image/upload/f_auto,q_auto/avatar_123"
   */
  buildCdnUrl(
    publicIdOrUrl: string,
    options: CloudinaryTransformOptions = {}
  ): string {
    if (!publicIdOrUrl) return '';

    // If it's already a full URL, pass through getTransformedUrl
    if (publicIdOrUrl.startsWith('http://') || publicIdOrUrl.startsWith('https://')) {
      return this.getTransformedUrl(publicIdOrUrl, options);
    }

    const config = this.getConfig();
    const cloudName = config.cloudName || 'demo';

    const {
      width,
      height,
      crop = 'fill',
      gravity = 'auto',
      quality = 'auto',
      format = 'auto',
    } = options;

    const segments: string[] = [`f_${format}`, `q_${quality}`];
    if (crop) segments.push(`c_${crop}`);
    if (gravity) segments.push(`g_${gravity}`);
    if (width) segments.push(`w_${width}`);
    if (height) segments.push(`h_${height}`);

    const transformation = segments.join(',');
    const cleanId = publicIdOrUrl.replace(/^\/+/, '');

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}/${cleanId}`;
  },

  /**
   * Get direct deep link to the user's Cloudinary Media Library console
   */
  getConsoleUrl(): string {
    const config = this.getConfig();
    if (config.cloudName) {
      return `https://console.cloudinary.com/pm/c-${config.cloudName}/media-explorer`;
    }
    return 'https://cloudinary.com/console';
  },

  /**
   * Tracked Assets in Local Storage
   */
  getTrackedAssets(): CloudinaryAsset[] {
    try {
      const stored = localStorage.getItem('titan_cloudinary_tracked_assets');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    // Default initial starter assets demonstrating engineering media
    return [
      {
        id: 'asset_arch_1',
        name: 'Distributed Queue Architecture',
        publicId: 'cld-sample-2',
        url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
        format: 'jpg',
        bytes: 142800,
        createdAt: Date.now() - 3600000 * 2,
        tag: 'ARCHITECTURE',
      },
      {
        id: 'asset_circuit_1',
        name: '4-Bit ALU Logic Circuit',
        publicId: 'cld-sample-4',
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        format: 'png',
        bytes: 98400,
        createdAt: Date.now() - 3600000 * 5,
        tag: 'CIRCUIT',
      },
    ];
  },

  saveTrackedAsset(asset: CloudinaryAsset): void {
    try {
      const existing = this.getTrackedAssets();
      const updated = [asset, ...existing.filter((a) => a.id !== asset.id)];
      localStorage.setItem('titan_cloudinary_tracked_assets', JSON.stringify(updated));
    } catch {
      // ignore
    }
  },

  deleteTrackedAsset(id: string): void {
    try {
      const existing = this.getTrackedAssets();
      const updated = existing.filter((a) => a.id !== id);
      localStorage.setItem('titan_cloudinary_tracked_assets', JSON.stringify(updated));
    } catch {
      // ignore
    }
  },

  /**
   * Real-Time Code Generator Snippets
   */
  generateReactSnippet(publicIdOrUrl: string, options: CloudinaryTransformOptions = {}): string {
    const width = options.width || 800;
    const height = options.height || 600;
    const crop = options.crop || 'fill';
    const quality = options.quality || 'auto';
    const format = options.format || 'auto';

    return `import { CldImage } from 'next-cloudinary';

// Production Optimized Component
export function EngineeringDiagram() {
  return (
    <CldImage
      src="${publicIdOrUrl}"
      width="${width}"
      height="${height}"
      crop="${crop}"
      quality="${quality}"
      format="${format}"
      alt="Engineering Diagram"
      sizes="(max-width: 768px) 100vw, 800px"
      priority
    />
  );
}`;
  },

  generateHtmlSnippet(publicIdOrUrl: string, options: CloudinaryTransformOptions = {}): string {
    const transformed = this.buildCdnUrl(publicIdOrUrl, options);
    const avifUrl = this.buildCdnUrl(publicIdOrUrl, { ...options, format: 'avif' });
    const webpUrl = this.buildCdnUrl(publicIdOrUrl, { ...options, format: 'webp' });

    return `<!-- High-Performance Responsive Picture Tag -->
<picture>
  <source srcset="${avifUrl}" type="image/avif" />
  <source srcset="${webpUrl}" type="image/webp" />
  <img
    src="${transformed}"
    alt="Engineering Asset"
    loading="lazy"
    decoding="async"
    width="${options.width || 800}"
    height="${options.height || 600}"
  />
</picture>`;
  },

  generateMarkdownSnippet(publicIdOrUrl: string, options: CloudinaryTransformOptions = {}): string {
    const url = this.buildCdnUrl(publicIdOrUrl, options);
    return `![Engineering Architecture Diagram](${url})`;
  },

  generateSdkSnippet(
    publicIdOrUrl: string,
    options: CloudinaryTransformOptions = {},
    lang: 'javascript' | 'python' = 'javascript'
  ): string {
    if (lang === 'python') {
      return `# Python Cloudinary SDK
import cloudinary
import cloudinary.uploader
import cloudinary.api

url = cloudinary.CloudinaryImage("${publicIdOrUrl}").build_url(
    width=${options.width || 800},
    height=${options.height || 600},
    crop="${options.crop || 'fill'}",
    quality="${options.quality || 'auto'}",
    fetch_format="${options.format || 'auto'}"
)
print("CDN Delivery URL:", url)`;
    }

    return `// Node.js / JavaScript Cloudinary SDK
const cloudinary = require('cloudinary').v2;

const url = cloudinary.url('${publicIdOrUrl}', {
  width: ${options.width || 800},
  height: ${options.height || 600},
  crop: '${options.crop || 'fill'}',
  quality: '${options.quality || 'auto'}',
  fetch_format: '${options.format || 'auto'}'
});

console.log('Optimized CDN URL:', url);`;
  },
};

export interface CloudinaryAsset {
  id: string;
  name: string;
  publicId: string;
  url: string;
  format: string;
  bytes: number;
  createdAt: number;
  tag?: string;
}
