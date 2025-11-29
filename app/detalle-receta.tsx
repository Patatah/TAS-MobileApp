import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Receta } from '@/hooks/tipos';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { View, FlatList } from 'react-native';

const SCREEN_OPTIONS = {
  title: 'Detalle de receta',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};



export default function DetalleRecetaScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const params = useLocalSearchParams<{
    index?: string;
    recetas?: string;
  }>();

  const recetas = React.useMemo(() => {
    try {
      return params.recetas ? JSON.parse(params.recetas) as Receta[] : [];
    } catch (e) {
      console.error('Error parsing recetas:', e);
      return [];
    }
  }, [params.recetas]);

  const initialIndex = React.useMemo(() => {
    const parsed = Number(params.index ?? 0);
    if (Number.isNaN(parsed)) return 0;
    if (parsed < 0) return 0;
    if (parsed >= recetas.length) return recetas.length - 1;
    return parsed;
  }, [params.index, recetas.length]);

  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  React.useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  if (recetas.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-50 px-6 dark:bg-black">
        <Text className="text-center text-zinc-500 dark:text-zinc-400">
          No hay recetas disponibles
        </Text>
      </View>
    );
  }

  const receta = recetas[currentIndex];

  const renderDetalle = ({ item }: { item: any }) => (
    <View className="mb-2 rounded-xl bg-white/95 p-3 shadow-sm dark:bg-zinc-900/95">
      <Text className="font-semibold">{item.medicamento?.nombre || 'Sin nombre'}</Text>
      <Text className="text-xs text-zinc-500 dark:text-zinc-400">
        {item.medicamento?.presentacion || 'N/A'}
      </Text>
      <Text className="mt-1 text-sm">
        Cantidad: <Text className="font-medium">{item.cantidad || 0}</Text>
      </Text>
      {item.medicamento?.esControlado && (
        <Text className="mt-1 text-xs font-medium text-orange-600 dark:text-orange-400">
          ⚠️ Medicamento controlado
        </Text>
      )}
    </View>
  );

  const formatDate = (date?: string | Date) => {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < recetas.length - 1;

  const handlePrev = () => {
    if (!canGoPrev) return;
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!canGoNext) return;
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />

      <View className="flex-1 bg-zinc-50 px-4 pb-6 pt-24 dark:bg-black">
        <View className="mb-4 rounded-2xl bg-white/95 p-4 shadow-sm dark:bg-zinc-900/95">
          <Text className="text-lg font-semibold">
            {receta.nombre || `Receta #${receta.idReceta}`}
          </Text>
          {receta.estado && (
            <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              Estado: <Text className="font-medium">{receta.estado}</Text>
            </Text>
          )}

          {receta.sucursalRecogida && (
              <View className="text-zinc-600 dark:text-zinc-300">
                <Text style={{ fontSize: 14 }}>
                  Sucursal: <Text className="font-medium">{receta.sucursalRecogida.nombre}</Text>
                </Text>
    
                <Text style={{ fontSize: 14}}>
                  Dirección: <Text className="font-medium">{receta.sucursalRecogida.direccion}</Text>
                </Text>
    
                <Text style={{ fontSize: 14 }}>
                  Teléfono: <Text className="font-medium">{receta.sucursalRecogida.telefono}</Text>
                </Text>
              </View>
          )}

          {receta.fechaLimiteRecogida && (
            <Text className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Límite de recogida: {formatDate(receta.fechaLimiteRecogida)}
            </Text>
          )}

          {receta.fechaCancelacion && (
            <Text className="mt-1 text-xs text-red-500">
              Cancelada el {formatDate(receta.fechaCancelacion)}
            </Text>
          )}

          {receta.pago && (
            <Text className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Total: ${receta.pago.monto.toFixed(2)}
            </Text>
          )}

          {receta.UsuarioCreador && (
            <Text className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Creado por: {receta.UsuarioCreador.name}
            </Text>
          )}
        </View>

        <Text className="mb-2 text-base font-semibold">
          Medicamentos de la receta
        </Text>

        {receta.lineas && receta.lineas.length > 0 ? (
          <FlatList
            data={receta.lineas}
            keyExtractor={(item, idx) => `linea-${idx}`}
            renderItem={renderDetalle}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-zinc-500 dark:text-zinc-400">
              No hay medicamentos en esta receta
            </Text>
          </View>
        )}

        <View className="mt-4 flex-row justify-between gap-3">
          <Button
            className="flex-1 rounded-2xl"
            disabled={!canGoPrev}
            onPress={handlePrev}
          >
            <Text
              className={
                'text-center text-sm font-medium ' +
                (isDark ? 'text-zinc-900' : 'text-white')
              }
            >
              Anterior
            </Text>
          </Button>
          <Button
            className="flex-1 rounded-2xl"
            disabled={!canGoNext}
            onPress={handleNext}
          >
            <Text
              className={
                'text-center text-sm font-medium ' +
                (isDark ? 'text-zinc-900' : 'text-white')
              }
            >
              Siguiente
            </Text>
          </Button>
        </View>
      </View>
    </>
  );
}
