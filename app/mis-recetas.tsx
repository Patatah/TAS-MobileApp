import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Stack, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';

type Receta = {
  idReceta: number;
  nombre: string;
  cedulaDoctor: string;
  estado: string;
  fechaLimiteRecogida: string;
  fechaCancelacion?: string | null;
  fechaCreacion: string;
  sucursalNombre?: string;
};

const MOCK_RECETAS: Receta[] = [
  {
    idReceta: 1,
    nombre: 'Receta para dolor de cabeza',
    cedulaDoctor: 'ABC123',
    estado: 'SURTIDA',
    fechaLimiteRecogida: '2025-11-30',
    fechaCancelacion: null,
    fechaCreacion: '2025-11-20',
    sucursalNombre: 'Farmacia Centro',
  },
  {
    idReceta: 2,
    nombre: 'Receta controlada',
    cedulaDoctor: 'DEF456',
    estado: 'SURTIÉNDOSE',
    fechaLimiteRecogida: '2025-12-05',
    fechaCancelacion: null,
    fechaCreacion: '2025-11-25',
    sucursalNombre: 'Farmacia Norte',
  },
  {
    idReceta: 3,
    nombre: 'Receta antibiótico',
    cedulaDoctor: 'GHI789',
    estado: 'CANCELADA',
    fechaLimiteRecogida: '2025-11-10',
    fechaCancelacion: '2025-11-09',
    fechaCreacion: '2025-11-05',
    sucursalNombre: 'Farmacia Sur',
  },
];

export default function MisRecetasScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const [search, setSearch] = React.useState('');
  const [fontScale, setFontScale] = React.useState(1);

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
        idReceta: item.idReceta.toString(),
        nombre: item.nombre,
        estado: item.estado,
        fechaCreacion: item.fechaCreacion,
        fechaLimiteRecogida: item.fechaLimiteRecogida,
        fechaCancelacion: item.fechaCancelacion ?? '',
        sucursalNombre: item.sucursalNombre ?? '',
      },
    });
  };

  const handleCerrarSesion = () => {
    router.replace('/');
  };

  const renderItem = ({ item, index }: { item: Receta; index: number }) => (
    <TouchableOpacity
      className="mb-3 rounded-2xl bg-white/95 p-4 shadow-sm dark:bg-zinc-900/95"
      onPress={() => handlePressReceta(item, index)}
    >
      <View className="mb-1 flex-row items-center justify-between">
        <Text
          className="font-semibold"
          style={{ fontSize: 16 * fontScale }}
        >
          {item.nombre}
        </Text>
        <View className="rounded-full bg-emerald-100 px-3 py-1 dark:bg-emerald-900/40">
          <Text
            className="font-medium text-emerald-700 dark:text-emerald-200"
            style={{ fontSize: 11 * fontScale }}
          >
            {item.estado}
          </Text>
        </View>
      </View>

      {item.sucursalNombre && (
        <Text
          className="text-zinc-600 dark:text-zinc-300"
          style={{ fontSize: 14 * fontScale }}
        >
          Sucursal:{' '}
          <Text className="font-medium" style={{ fontSize: 14 * fontScale }}>
            {item.sucursalNombre}
          </Text>
        </Text>
      )}

      <Text
        className="mt-1 text-zinc-500 dark:text-zinc-400"
        style={{ fontSize: 12 * fontScale }}
      >
        Creada el {item.fechaCreacion}
      </Text>
      <Text
        className="text-zinc-500 dark:text-zinc-400"
        style={{ fontSize: 12 * fontScale }}
      >
        Límite de recogida: {item.fechaLimiteRecogida}
      </Text>

      {item.fechaCancelacion && (
        <Text
          className="mt-1 text-red-500"
          style={{ fontSize: 12 * fontScale }}
        >
          Cancelada el {item.fechaCancelacion}
        </Text>
      )}
    </TouchableOpacity>
  );

  const filteredRecetas = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return MOCK_RECETAS;

    return MOCK_RECETAS.filter((r) => {
      const nombre = r.nombre.toLowerCase();
      const estado = r.estado.toLowerCase();
      const sucursal = (r.sucursalNombre ?? '').toLowerCase();

      return (
        nombre.includes(term) ||
        estado.includes(term) ||
        sucursal.includes(term)
      );
    });
  }, [search]);

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

          <FlatList
            data={filteredRecetas}
            keyExtractor={(item) => item.idReceta.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
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
