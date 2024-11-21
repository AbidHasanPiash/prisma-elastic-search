'use client';

import { Input } from '@/components/ui/input';
import { useFormik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/common/Spinner';
import InputWrapper from '@/components/ui/input-wrapper';
import Submit from '@/components/button/Submit';
import { RiSendPlaneLine } from 'react-icons/ri';
import { postData } from '@/utils/axios';
import apiConfig from '@/configs/apiConfig';

// Yup validation schema
const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
});

export default function StoryForm() {
    const router = useRouter();

    const initialValues = {
        title: '',
        content: ''
    };

    const submit = async (data) => {
        await postData(apiConfig?.CREATE_STORY, data);
    };
    
    const onSuccess = () => {
        formik.resetForm();
        // router.push('/')
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => mutation.mutate(values),
    });

    const mutation = useMutation({
        mutationKey: ['create-story'],
        mutationFn: submit,
        onSuccess,
    });
    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col items-center justify-center space-y-4 w-full">

            <InputWrapper label="title" error={formik.errors?.title} touched={formik.touched?.title}>
                <Input
                    name="title"
                    placeholder="title"
                    value={formik.values?.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
            </InputWrapper>

            <InputWrapper label="content" error={formik.errors?.content} touched={formik.touched?.content}>
                <Input
                    name="content"
                    placeholder="content"
                    value={formik.values?.content}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
            </InputWrapper>

            <div>
                <Submit
                    disabled={mutation.isPending}
                    label={mutation.isPending ? 'Submitting...' : 'Submit'} // Dynamic label
                    icon={mutation.isPending ? <Spinner size="4" /> : <RiSendPlaneLine />} // Dynamic icon
                />
            </div>
        </form>
    )
}
