import { ArrowRight } from 'lucide-react'
import { UploadZone, Btn, Alert } from './UI'

export default function GridStepImport({ source, loading, error, loadFile, onNext, canProceed }) {
  return (
    <div>
      <Alert type="info">
        Chargez un fichier contenant plusieurs grilles croisées superposées (par exemple des grilles tarifaires largeur × hauteur, répétées par produit et par type). L'application détectera automatiquement les axes, que vous pourrez ajuster ensuite.
      </Alert>

      <div className="max-w-md mx-auto my-6">
        <UploadZone
          label="Fichier de grilles"
          hint="XLS, XLSX, CSV"
          file={source.file}
          loading={loading}
          error={error}
          onChange={f => loadFile(f)}
        />
        {source.data.length > 0 && (
          <p className="text-xs text-ink-400 mt-2 text-center">
            {source.data.length} lignes × {(source.data[0] || []).length} colonnes détectées
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Btn variant="primary" onClick={onNext} disabled={!canProceed}>
          Configurer les axes <ArrowRight size={14} />
        </Btn>
      </div>
    </div>
  )
}
