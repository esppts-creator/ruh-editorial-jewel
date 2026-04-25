CREATE TABLE public.billboard_slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  eyebrow TEXT,
  image_url TEXT NOT NULL,
  cta_label TEXT,
  cta_link TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.billboard_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active slides"
  ON public.billboard_slides FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all slides"
  ON public.billboard_slides FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert slides"
  ON public.billboard_slides FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update slides"
  ON public.billboard_slides FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete slides"
  ON public.billboard_slides FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_billboard_slides_updated_at
BEFORE UPDATE ON public.billboard_slides
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();