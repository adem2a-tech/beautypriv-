import type { ReactNode } from "react";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import confetti from "canvas-confetti";
import { Button, type ButtonProps } from "@/components/ui/button";

type ConfettiOptions = Parameters<typeof confetti>[0];

type Api = {
  fire: (options?: ConfettiOptions) => void;
};

type Props = React.ComponentPropsWithRef<"canvas"> & {
  options?: ConfettiOptions;
  manualstart?: boolean;
  children?: ReactNode;
};

export type ConfettiRef = Api | null;

const Confetti = forwardRef<ConfettiRef, Props>((props, ref) => {
  const {
    options,
    manualstart = false,
    children,
    ...rest
  } = props;
  const instanceRef = useRef<((opts?: ConfettiOptions) => void) | null>(null);

  const canvasRef = useCallback(
    (node: HTMLCanvasElement | null) => {
      if (node !== null) {
        if (instanceRef.current) return;
        instanceRef.current = confetti.create(node, { resize: true });
      } else {
        instanceRef.current = null;
      }
    },
    [],
  );

  const fire = useCallback(
    (opts?: ConfettiOptions) => instanceRef.current?.({ ...options, ...opts }),
    [options],
  );

  const api = useMemo(() => ({ fire }), [fire]);
  useImperativeHandle(ref, () => api, [api]);

  React.useEffect(() => {
    if (!manualstart) fire();
  }, [manualstart, fire]);

  return (
    <>
      <canvas ref={canvasRef} {...rest} />
      {children}
    </>
  );
});

Confetti.displayName = "Confetti";

interface ConfettiButtonProps extends ButtonProps {
  options?: ConfettiOptions;
  children?: React.ReactNode;
}

function ConfettiButton({ options, children, ...props }: ConfettiButtonProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    confetti({
      ...options,
      origin: {
        x: x / window.innerWidth,
        y: y / window.innerHeight,
      },
    });
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}

export { Confetti, ConfettiButton };
