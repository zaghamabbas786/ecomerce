'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ImageUploader } from '@/components/image-uploader';
import { createProduct, updateProduct } from '@/actions/product-actions';
import { toast } from '@/hooks/use-toast';
import { Plus, X } from 'lucide-react';

interface ProductFormProps {
  product?: any;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [sizes, setSizes] = useState<string[]>(product?.sizes || ['S', 'M', 'L']);
  const [colors, setColors] = useState<string[]>(product?.colors || ['Black', 'White']);
  const [variants, setVariants] = useState<any[]>(product?.variants || []);

  // Generate initial variants if editing
  useState(() => {
    if (product && variants.length === 0) {
      const initialVariants: any[] = [];
      product.sizes.forEach((size: string) => {
        product.colors.forEach((color: string) => {
          const existingVariant = product.variants.find(
            (v: any) => v.size === size && v.color === color
          );
          initialVariants.push({
            size,
            color,
            stock: existingVariant?.stock || 0,
          });
        });
      });
      setVariants(initialVariants);
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Generate variants from sizes and colors
    const generatedVariants: any[] = [];
    sizes.forEach((size) => {
      colors.forEach((color) => {
        const existingVariant = variants.find(
          (v) => v.size === size && v.color === color
        );
        generatedVariants.push({
          size,
          color,
          stock: existingVariant?.stock || 0,
        });
      });
    });

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      category: formData.get('category') as string,
      sizes,
      colors,
      images,
      variants: generatedVariants,
      featured: formData.get('featured') === 'on',
    };

    const result = product
      ? await updateProduct(product._id, data)
      : await createProduct(data);

    setLoading(false);

    if ('success' in result && result.success) {
      toast({
        title: 'Success',
        description: `Product ${product ? 'updated' : 'created'} successfully`,
      });
      router.push('/admin/products');
    } else {
      toast({
        title: 'Error',
        description: ('error' in result ? result.error : undefined) || 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  const addSize = () => {
    const newSize = prompt('Enter size:');
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
    }
  };

  const removeSize = (size: string) => {
    setSizes(sizes.filter((s) => s !== size));
  };

  const addColor = () => {
    const newColor = prompt('Enter color:');
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
    }
  };

  const removeColor = (color: string) => {
    setColors(colors.filter((c) => c !== color));
  };

  const updateVariantStock = (size: string, color: string, stock: number) => {
    setVariants((prev) => {
      const existing = prev.find((v) => v.size === size && v.color === color);
      if (existing) {
        return prev.map((v) =>
          v.size === size && v.color === color ? { ...v, stock } : v
        );
      }
      return [...prev, { size, color, stock }];
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={product?.title}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={product?.description}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product?.price}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                name="category"
                defaultValue={product?.category}
                required
              />
            </div>
          </div>

          <div>
            <Label>Images *</Label>
            <ImageUploader value={images} onChange={setImages} />
          </div>

          <div>
            <Label>Sizes *</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {sizes.map((size) => (
                <div
                  key={size}
                  className="flex items-center gap-1 bg-muted px-3 py-1 rounded"
                >
                  <span>{size}</span>
                  <button
                    type="button"
                    onClick={() => removeSize(size)}
                    className="text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addSize}>
              <Plus className="h-4 w-4 mr-1" />
              Add Size
            </Button>
          </div>

          <div>
            <Label>Colors *</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {colors.map((color) => (
                <div
                  key={color}
                  className="flex items-center gap-1 bg-muted px-3 py-1 rounded"
                >
                  <span>{color}</span>
                  <button
                    type="button"
                    onClick={() => removeColor(color)}
                    className="text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addColor}>
              <Plus className="h-4 w-4 mr-1" />
              Add Color
            </Button>
          </div>

          <div>
            <Label>Stock by Variant</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {sizes.map((size) =>
                colors.map((color) => {
                  const variant = variants.find(
                    (v) => v.size === size && v.color === color
                  );
                  return (
                    <div key={`${size}-${color}`}>
                      <Label className="text-xs">
                        {size} - {color}
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        defaultValue={variant?.stock || 0}
                        onChange={(e) =>
                          updateVariantStock(size, color, Number(e.target.value))
                        }
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              defaultChecked={product?.featured}
              className="rounded"
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Featured Product
            </Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

