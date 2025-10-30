'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, File, X } from 'lucide-react';

const categories = [
    'Exame Laboratorial',
    'Exame de Imagem',
    'Receita',
    'Laudo Médico',
    'Relatório de Enfermagem',
    'Evolução Fisioterapia',
    'Plano Alimentar Nutrição',
    'Outros'
];

export function ProntuarioUploadDialog({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const [files, setFiles] = React.useState<File[]>([]);
  const [category, setCategory] = React.useState<string>('');
  const dragCounter = React.useRef(0);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if(e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if(dragCounter.current === 0) {
      setIsDragging(false);
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (files.length === 0) {
        toast({ title: "Nenhum arquivo selecionado", description: "Por favor, selecione um arquivo para anexar.", variant: "destructive" });
        return;
    }
    if (!category) {
        toast({ title: "Nenhuma categoria selecionada", description: "Por favor, escolha uma categoria para o documento.", variant: "destructive" });
        return;
    }

    // Placeholder for actual upload logic
    toast({
      title: 'Upload Iniciado (Simulação)',
      description: `${files.length} arquivo(s) sendo enviados para a categoria "${category}".`,
    });

    // Reset state and close dialog
    setFiles([]);
    setCategory('');
    onOpenChange(false);
  };

  const closeDialog = () => {
    setFiles([]);
    setCategory('');
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Anexar Novo Documento</DialogTitle>
          <DialogDescription>
            Selecione um arquivo e uma categoria para organizá-lo no prontuário do paciente.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
            <div 
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
                <UploadCloud className={`w-12 h-12 mb-4 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                <p className="font-semibold text-center">Arraste e solte o arquivo aqui</p>
                <p className="text-sm text-muted-foreground text-center">ou clique para selecionar</p>
                <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} multiple />
            </div>
            
            {files.length > 0 && (
                <div className="space-y-2">
                    <Label>Arquivos Selecionados:</Label>
                    <ul className="space-y-2 max-h-32 overflow-y-auto">
                        {files.map((file, index) => (
                            <li key={index} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <File className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">{file.name}</span>
                                </div>
                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleRemoveFile(index)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="grid gap-2">
                <Label htmlFor="category">Categoria do Documento</Label>
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Selecione uma categoria..." />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={closeDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={files.length === 0 || !category}>
            Anexar Documento(s)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
