import { ArrowRight } from 'lucide-react'
import { UploadZone, Btn } from './UI'

export default function StepImport({ source, target, loading, errors, loadFile, onNext }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-ink-700 mb-2">Fichier source</p>
          <UploadZone
            label="Fichier à convertir"
            hint="XLS, XLSX, CSV, TXT"
            file={source.file}
            loading={loading.source}
            error={errors.source}
            onChange={f => loadFile('source', f)}
          />
          {source.headers.length > 0 && (
            <p className="text-xs text-ink-400 mt-2 text-center">
              {source.headers.length} colonnes · {source.data.length} lignes
            </p>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-ink-700 mb-2">Fichier cible</p>
          <UploadZone
            label="Format de destination"
            hint="XLS, XLSX, CSV, TXT"
            file={target.file}
            loading={loading.target}
            error={errors.target}
            onChange={f => loadFile('target', f)}
          />
          {target.headers.length > 0 && (
            <p className="text-xs text-ink-400 mt-2 text-center">
              {target.headers.length} colonnes · {target.data.length} lignes
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <Btn variant="primary" onClick={onNext}
          disabled={!source.headers.length || !target.headers.length}>
          Configurer le mapping <ArrowRight size={14} />
        </Btn>
      </div>
    </div>
  )
}
