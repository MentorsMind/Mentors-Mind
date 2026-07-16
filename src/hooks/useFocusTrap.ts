import { useEffect, useRef } from 'react';

export function useFocusTrap(isOpen: boolean, onClose: () => void) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
      return;
    }

    // Save previous active element
    previousFocusRef.current = document.activeElement as HTMLElement;

    const modalElement = modalRef.current;
    if (!modalElement) return;

    // Find all focusable elements
    const focusableElementsString =
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
    let focusableElements = Array.from(
      modalElement.querySelectorAll<HTMLElement>(focusableElementsString)
    ).filter(el => {
      // Check if element is visible
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetWidth > 0;
    });

    if (focusableElements.length === 0) {
      // Add a fallback focusable element if none exists
      modalElement.setAttribute('tabindex', '-1');
      focusableElements = [modalElement];
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        // Update focusable elements in case DOM changed
        focusableElements = Array.from(
          modalElement.querySelectorAll<HTMLElement>(focusableElementsString)
        ).filter(el => {
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetWidth > 0;
        });

        if (focusableElements.length === 0) return;

        const currentFirst = focusableElements[0];
        const currentLast = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === currentFirst) {
            currentLast.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === currentLast) {
            currentFirst.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return modalRef;
}
