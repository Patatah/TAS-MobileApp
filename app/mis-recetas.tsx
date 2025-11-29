import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuth } from '@/hooks/UseAuth';
import { useRecetas } from '@/hooks/useRecetas';
import { Receta } from '@/hooks/tipos';
import { Stack, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';



export default function MisRecetasScreen() {
  const {logout} = useAuth();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const [search, setSearch] = React.useState('');
  const [fontScale, setFontScale] = React.useState(1);

  const { recetas, refetch, loading, error} = useRecetas();

  const handleIncreaseFont = () => {
    setFontScale((prev) => {
      if (prev < 1.2) return 1.2;
      if (prev < 1.4) return 1.4;
      return 1;
    });
  };

  const handlePressReceta = (item: Receta, index: number) => {
    router.push({
      pathname: '/detalle-receta',
      params: {
        index: index.toString(),
        idReceta: item.idReceta?.toString() ?? '',
        nombre: item.nombre ?? 'Sin nombre',
        estado: item.estado ?? 'DESCONOCIDO',
        fechaLimiteRecogida: item.fechaLimiteRecogida?.toString() ?? '',
        fechaCancelacion: item.fechaCancelacion?.toString() ?? '',
        sucursalNombre: item.sucursalRecogida?.nombre ?? '',
      },
    });
  };

  const handleCerrarSesion = () => {
    logout();
    router.replace('/');
  };

  const renderItem = ({ item, index }: { item: Receta; index: number }) => {
    const formatDate = (date?: string | Date) => {
      if (!date) return 'N/A';
      const d = typeof date === 'string' ? new Date(date) : date;
      return d.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    return (
      <TouchableOpacity
        className="mb-3 rounded-2xl bg-white/95 p-4 shadow-sm dark:bg-zinc-900/95"
        onPress={() => handlePressReceta(item, index)}
      >
        <View className="mb-1 flex-row items-center justify-between">
          <Text
            className="flex-1 font-semibold"
            style={{ fontSize: 16 * fontScale }}
          >
            {item.nombre || `Receta #${item.idReceta}`}
          </Text>
          {item.estado && (
            <View className="rounded-full bg-emerald-100 px-3 py-1 dark:bg-emerald-900/40">
              <Text
                className="font-medium text-emerald-700 dark:text-emerald-200"
                style={{ fontSize: 11 * fontScale }}
              >
                {item.estado}
              </Text>
            </View>
          )}
        </View>

        {item.sucursalRecogida && (
          <Text
            className="text-zinc-600 dark:text-zinc-300"
            style={{ fontSize: 14 * fontScale }}
          >
            Sucursal:{' '}
            <Text className="font-medium" style={{ fontSize: 14 * fontScale }}>
              {item.sucursalRecogida.nombre}
            </Text>
          </Text>
        )}

        {item.fechaLimiteRecogida && (
          <Text
            className="mt-1 text-zinc-500 dark:text-zinc-400"
            style={{ fontSize: 12 * fontScale }}
          >
            Límite de recogida: {formatDate(item.fechaLimiteRecogida)}
          </Text>
        )}

        {item.fechaCancelacion && (
          <Text
            className="mt-1 text-red-500"
            style={{ fontSize: 12 * fontScale }}
          >
            Cancelada el {formatDate(item.fechaCancelacion)}
          </Text>
        )}

        {item.pago && (
          <Text
            className="mt-1 text-zinc-600 dark:text-zinc-300"
            style={{ fontSize: 12 * fontScale }}
          >
            Monto: ${item.pago.monto.toFixed(2)}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const filteredRecetas = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return recetas;

    return recetas.filter((r) => {
      const nombre = (r.nombre ?? '').toLowerCase();
      const estado = (r.estado ?? '').toLowerCase();
      const sucursal = (r.sucursalRecogida?.nombre ?? '').toLowerCase();

      return (
        nombre.includes(term) ||
        estado.includes(term) ||
        sucursal.includes(term)
      );
    });
  }, [search, recetas]);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Te Acerco Salud',
          headerTransparent: true,
          headerRight: () => (
            <View className="flex-row items-center gap-2 pr-2">
              <TouchableOpacity
                onPress={handleIncreaseFont}
                className="rounded-full border border-zinc-300 px-3 py-1 dark:border-zinc-700"
              >
                <Text
                  className="font-semibold"
                  style={{
                    fontSize: 12 * fontScale,
                    color: isDark ? '#e5e7eb' : '#3f3f46',
                  }}
                >
                  Aa
                </Text>
              </TouchableOpacity>
              <ThemeToggle />
            </View>
          ),
        }}
      />

      <View className="flex-1 bg-zinc-50 px-4 pb-6 pt-24 dark:bg-black">
        <View className="flex-1">
          <Text
            className="mb-1 font-semibold"
            style={{ fontSize: 20 * fontScale }}
          >
            Mis recetas
          </Text>
          <Text
            className="text-zinc-600 dark:text-zinc-300"
            style={{ fontSize: 14 * fontScale }}
          >
            Consulta el estado de tus recetas
          </Text>

          <View className="mt-4 mb-4 flex-row items-center rounded-2xl border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900">
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar por nombre, estado o sucursal"
              className="flex-1 text-zinc-900 dark:text-zinc-100"
              style={{ fontSize: 14 * fontScale }}
              placeholderTextColor={isDark ? '#71717A' : '#A1A1AA'}
            />
          </View>

          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color={isDark ? '#e5e7eb' : '#3f3f46'} />
              <Text className="mt-2 text-zinc-500 dark:text-zinc-400" style={{ fontSize: 14 * fontScale }}>
                Cargando recetas...
              </Text>
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-red-500" style={{ fontSize: 14 * fontScale }}>
                Error: {error}
              </Text>
            </View>
          ) : filteredRecetas.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 14 * fontScale }}>
                No se encontraron recetas
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredRecetas}
              refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
              keyExtractor={(item, idx) => item.idReceta?.toString() ?? idx.toString()}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
          )}
        </View>

        <Button
          className={
            'mt-4 w-full rounded-2xl ' +
            (isDark ? 'bg-white' : 'bg-black')
          }
          onPress={handleCerrarSesion}
        >
          <Text
            className="text-center text-sm font-medium"
            style={{
              fontSize: 14 * fontScale,
              color: isDark ? '#000000' : '#ffffff',
            }}
          >
            Cerrar sesión
          </Text>
        </Button>
      </View>
    </>
  );
}
