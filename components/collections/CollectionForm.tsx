"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"

import { Separator } from "../ui/separator"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import ImageUpload from "../custom.ui/ImageUpload"
import { useState } from "react"
import toast from "react-hot-toast"


const formSchema = z.object({
    Title: z.string().min(2).max(20),
    Description: z.string().min(2).max(500).trim(),
    Image: z.string()
})

const CollectionForm = () => {
    const router = useRouter();

    const [loading, setloading ] = useState (false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            Title: "",
            Description: "",
            Image: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            setloading(true);
            const res = await fetch ("/api/collections", {
                method: "POST",
                body: JSON.stringify(values),
            });
            if (res.ok) {
                setloading (false);
                toast.success("Collection created")
                router.push("/collections");
            }

        } catch (err){
            console.log("[collections_POST]", err);
            toast.error("Something went wrong! please try again")
        }
    };

    return (
        <div className="p-10">
            <p className="text-heading2-bold">Create Collection</p>
            <Separator className=" bg-grey-1 mt-4 mb-7" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="Title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="Description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Description" {...field} rows={5} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="Image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                    <ImageUpload value={field.value ? [field.value] : []}
                                     onChange={(url) => field.onChange(url)}
                                     onRemove={() => field.onChange("")}
                                     />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-10">
                    <Button type="submit" className="bg-blue-1 text-white">Submit</Button>
                    <Button type="button" onClick={() => router.push("/collections")} className="bg-blue-1 text-white">Discard</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default CollectionForm
