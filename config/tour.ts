import { OnboardingStep } from '@onboardjs/core';

export const tourSteps: OnboardingStep[] = [
    {
        id: 'step-movement',
        type: 'CUSTOM_COMPONENT',
        payload: {
            componentKey: 'GLOBAL',
            targetId: 'tour-canvas-area',
            title: 'Explore the Scene',
            description: 'Drag to rotate and pan the camera. Use your Arrow Keys (desktop) or Joystick (mobile) to walk around the environment.',
        },
        nextStep: 'step-canvas',
    },
    {
        id: 'step-canvas',
        type: 'CUSTOM_COMPONENT',
        payload: {
            componentKey: 'GLOBAL',
            targetId: 'tour-canvas-center',
            title: 'Select Model Area',
            description: 'Tap on the 3D model in the center to select it and reveal editing options.',
        },
        previousStep: 'step-movement',
        nextStep: 'step-texture',
    },
    {
        id: 'step-texture',
        type: 'CUSTOM_COMPONENT',
        payload: {
            componentKey: 'GLOBAL',
            targetId: 'tour-texture-carousel',
            title: 'Texture Carousel',
            description: 'Swipe through quick materials and textures to apply them instantly.',
        },
        previousStep: 'step-canvas',
        nextStep: 'step-packs',
    },
    {
        id: 'step-packs',
        type: 'CUSTOM_COMPONENT',
        payload: {
            componentKey: 'GLOBAL',
            targetId: 'tour-packs-btn',
            title: 'Texture Packs',
            description: 'Browse categorized, high-quality material packs for your scene.',
        },
        previousStep: 'step-texture',
        nextStep: 'step-views',
    },
    {
        id: 'step-views',
        type: 'CUSTOM_COMPONENT',
        payload: {
            componentKey: 'GLOBAL',
            targetId: 'tour-saved-views',
            title: 'Saved Views',
            description: 'Bookmark your favorite camera angles. Great for consistent rendering.',
        },
        previousStep: 'step-packs',
        nextStep: 'step-capture',
    },
    {
        id: 'step-capture',
        type: 'CUSTOM_COMPONENT',
        payload: {
            componentKey: 'GLOBAL',
            targetId: 'tour-capture-btn',
            title: 'Capture Scene',
            description: 'Take a high-resolution, watermark-free snapshot of your environment.',
        },
        previousStep: 'step-views',
        nextStep: null,
    }
];

export const tourRegistry = {
    GLOBAL: () => null
};
