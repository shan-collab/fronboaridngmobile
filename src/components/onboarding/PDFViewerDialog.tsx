import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { ChevronLeft, ChevronRight, FileText, Download } from "lucide-react";

interface PDFViewerDialogProps {
  title: string;
  onConfirm?: () => void;
  confirmed?: boolean;
  trigger: React.ReactNode;
  showDownload?: boolean;
  contractContent?: React.ReactNode;
  onAllPagesRead?: () => void;
}

const PDFViewerDialog = ({ title, onConfirm, confirmed, trigger, showDownload, contractContent, onAllPagesRead }: PDFViewerDialogProps) => {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [maxPageReached, setMaxPageReached] = useState(1);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const totalPages = contractContent ? 1 : 3;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (newPage > maxPageReached) {
      setMaxPageReached(newPage);
    }
    if (newPage === totalPages && onAllPagesRead && !contractContent) {
      onAllPagesRead();
    }
  };

  // For single-page content (like contract), require scroll to bottom
  const handleScroll = () => {
    if (contractContent && contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        if (!hasScrolledToEnd && onAllPagesRead) {
          setHasScrolledToEnd(true);
          onAllPagesRead();
        }
      }
    }
  };

  const handleOpen = (v: boolean) => {
    setOpen(v);
    if (v) {
      setCurrentPage(1);
      setMaxPageReached(1);
      setHasScrolledToEnd(false);
    }
  };

  const pages = [
    <div key={1} className="space-y-3">
      <div className="text-center border-b border-border pb-3">
        <h3 className="font-bold text-sm text-foreground">{title}</h3>
        <p className="text-[10px] text-muted-foreground">{t("page")} 1/3</p>
      </div>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas quis suscipit ex. Quisque tincidunt, nunc sed aliquam tincidunt, est nisi posuere nunc, ac gravida velit est ac mauris.
      </p>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec vel sapien auctor, dignissim arcu a, gravida enim.
      </p>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.
      </p>
    </div>,
    <div key={2} className="space-y-3">
      <div className="text-center border-b border-border pb-3">
        <h3 className="font-bold text-sm text-foreground">{title}</h3>
        <p className="text-[10px] text-muted-foreground">{t("page")} 2/3</p>
      </div>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Cras mattis consectetur purus sit amet fermentum. Donec id elit non mi porta gravida at eget metus.
      </p>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Duis mollis, est non commodo luctus.
      </p>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Aenean lacinia bibendum nulla sed consectetur.
      </p>
    </div>,
    <div key={3} className="space-y-3">
      <div className="text-center border-b border-border pb-3">
        <h3 className="font-bold text-sm text-foreground">{title}</h3>
        <p className="text-[10px] text-muted-foreground">{t("page")} 3/3</p>
      </div>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Aenean eu leo quam.
      </p>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Donec ullamcorper nulla non metus auctor fringilla. Maecenas sed diam eget risus varius blandit.
      </p>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Nulla vitae elit libero, a pharetra augue. Fusce dapibus, tellus ac cursus commodo.
      </p>
      {onConfirm && !confirmed && (
        <div className="pt-3 border-t border-border">
          <Button
            onClick={() => { onConfirm(); setOpen(false); }}
            className="w-full h-8 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            {t("confirm_read")}
          </Button>
        </div>
      )}
      {confirmed && (
        <div className="pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
            <FileText className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[11px] font-medium text-emerald-700">{t("document_confirmed")}</span>
          </div>
        </div>
      )}
    </div>,
  ];

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-sm max-h-[80vh] overflow-hidden p-0">
        <div className="bg-card p-4 overflow-y-auto max-h-[75vh]" ref={contentRef} onScroll={handleScroll}>
          {contractContent || pages[currentPage - 1]}
          {!contractContent && (
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <Button
                variant="outline" size="sm" className="h-7 text-[10px] gap-1"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft className="w-3 h-3" /> {t("previous")}
              </Button>
              <span className="text-[10px] text-muted-foreground">{currentPage} / {totalPages}</span>
              <Button
                variant="outline" size="sm" className="h-7 text-[10px] gap-1"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                {t("next_page")} <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          )}
          {showDownload && (
            <div className="mt-3 pt-3 border-t border-border">
              <Button variant="outline" size="sm" className="w-full gap-1 h-7 text-[10px]">
                <Download className="w-3 h-3" /> {t("download_pdf")}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewerDialog;
