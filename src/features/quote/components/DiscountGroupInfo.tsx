import React from 'react';

interface DiscountGroupInfoProps {
    isOpen: boolean;
    onClose: () => void;
}

function DiscountGroupInfo({ isOpen, onClose }: DiscountGroupInfoProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">
                        📦 Grupos de Descuento por Mayoreo
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Introduction */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">¿Qué son los grupos de descuento?</h4>
                        <p className="text-sm text-blue-800">
                            Los grupos te permiten combinar varios productos del mismo proveedor para alcanzar 
                            los descuentos por mayoreo más rápido. Todos los productos en el mismo grupo suman 
                            sus cantidades para calcular el descuento.
                        </p>
                    </div>

                    {/* How it works */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Cómo funciona:</h4>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
                                    1
                                </div>
                                <div>
                                    <p className="text-sm text-gray-700">
                                        <strong>Escribe un nombre de grupo</strong> en el campo "Grupo Dto" (por ejemplo: "A", "1", "Bolígrafos")
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
                                    2
                                </div>
                                <div>
                                    <p className="text-sm text-gray-700">
                                        <strong>Asigna el mismo nombre</strong> a otros productos del mismo proveedor que quieras agrupar
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
                                    3
                                </div>
                                <div>
                                    <p className="text-sm text-gray-700">
                                        <strong>El sistema suma automáticamente</strong> (costo con descuento × cantidad) de todos los productos del grupo
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
                                    4
                                </div>
                                <div>
                                    <p className="text-sm text-gray-700">
                                        <strong>Se aplica el descuento por mayoreo</strong> correspondiente a todo el grupo si alcanza el monto mínimo
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Example */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Ejemplo práctico:</h4>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                            <div className="text-sm">
                                <p className="font-medium text-gray-700 mb-2">Proveedor: PROMOS (Descuento mayoreo: $5,000 = 10% adicional)</p>
                                <div className="space-y-2 ml-4">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block w-16 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Grupo A</span>
                                        <span className="text-gray-600">Producto 1: $30 × 100 = $3,000</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block w-16 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Grupo A</span>
                                        <span className="text-gray-600">Producto 2: $40 × 60 = $2,400</span>
                                    </div>
                                    <div className="border-t border-gray-300 pt-2 mt-2">
                                        <p className="font-semibold text-gray-900">
                                            Total Grupo A: $5,400 → ✅ Califica para 10% adicional
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Important notes */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Importante:</h4>
                        <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                            <li>Solo se agrupan productos del <strong>mismo proveedor</strong></li>
                            <li>Puedes crear <strong>múltiples grupos</strong> para el mismo proveedor (A, B, C, etc.)</li>
                            <li>Si no asignas grupo, el producto se calcula individualmente</li>
                            <li>Los descuentos se aplican a todos los productos del grupo por igual</li>
                        </ul>
                    </div>

                    {/* Tips */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-semibold text-green-900 mb-2">💡 Consejos:</h4>
                        <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
                            <li>Usa nombres cortos y descriptivos: "A", "B", "1", "2"</li>
                            <li>Agrupa productos similares o relacionados</li>
                            <li>Verifica que todos tengan el mismo proveedor</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DiscountGroupInfo;
