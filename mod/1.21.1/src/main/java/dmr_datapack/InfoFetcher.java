package dmr_datapack;

import com.google.gson.JsonArray;
import net.minecraft.core.Holder;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.core.registries.Registries;
import net.minecraft.data.CachedOutput;
import net.minecraft.data.DataGenerator;
import net.minecraft.data.DataProvider;
import net.minecraft.data.PackOutput;
import net.minecraft.world.item.Item;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.fml.common.EventBusSubscriber.Bus;
import net.neoforged.neoforge.data.event.GatherDataEvent;
import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@EventBusSubscriber( modid = DMRDatapack.MODID, bus = Bus.MOD)
public class InfoFetcher {
	
	@SubscribeEvent
	public static void gather(GatherDataEvent event) {
		DataGenerator generator = event.getGenerator();
		PackOutput output = generator.getPackOutput();
		var lookupProvider = event.getLookupProvider();
		generator.addProvider(
				true,
			new DataProvider() {
				
				@Override
				public CompletableFuture<?> run(CachedOutput cachedOutput) {
					List<CompletableFuture<?>> list = new ArrayList<>();
					var path = output.getOutputFolder();
					
					var itemJson = new JsonArray();
					BuiltInRegistries.ITEM.stream().sorted(Comparator.comparing(Item::getDescriptionId)).forEach(item -> {
						var id = item.getDescriptionId();
						if(id.startsWith("item.")){
							itemJson.add(BuiltInRegistries.ITEM.getKey(item).toString());
						}
					});
					list.add(DataProvider.saveStable(cachedOutput, itemJson, path.resolve("items.json")));
					
					var lootTablesJson = new JsonArray();
					try {
						lookupProvider.get().lookup(Registries.LOOT_TABLE).ifPresent((lookup) -> lookup.listElements().sorted(Comparator.comparing(Holder::getRegisteredName)).forEach((lootTable) -> lootTablesJson.add(lootTable.getRegisteredName())));
					} catch (InterruptedException | ExecutionException e) {
						throw new RuntimeException(e);
					}
					
					list.add(DataProvider.saveStable(cachedOutput, lootTablesJson, path.resolve("loot_tables.json")));
					
					var soundEventsJson = new JsonArray();
					try {
						lookupProvider.get().lookup(Registries.SOUND_EVENT).ifPresent((lookup) -> lookup.listElements().sorted(Comparator.comparing(Holder::getRegisteredName)).forEach((soundEvent) -> soundEventsJson.add(soundEvent.getRegisteredName())));
					} catch (InterruptedException | ExecutionException e) {
						throw new RuntimeException(e);
					}
					
					list.add(DataProvider.saveStable(cachedOutput, soundEventsJson, path.resolve("sound_events.json")));
					
					
					var attributesJson = new JsonArray();
					try {
						lookupProvider.get().lookup(Registries.ATTRIBUTE).ifPresent((lookup) -> lookup.listElements().sorted(Comparator.comparing(Holder::getRegisteredName)).forEach((attribute) -> attributesJson.add(attribute.getRegisteredName())));
					} catch (InterruptedException | ExecutionException e) {
						throw new RuntimeException(e);
					}
					
					list.add(DataProvider.saveStable(cachedOutput, attributesJson, path.resolve("attributes.json")));
					
					
					var particlesJson = new JsonArray();
					try {
						lookupProvider.get().lookup(Registries.PARTICLE_TYPE).ifPresent((lookup) -> lookup.listElements().sorted(Comparator.comparing(Holder::getRegisteredName)).forEach((particle) -> particlesJson.add(particle.getRegisteredName())));
					} catch (InterruptedException | ExecutionException e) {
						throw new RuntimeException(e);
					}
					
					list.add(DataProvider.saveStable(cachedOutput, particlesJson, path.resolve("particles.json")));
					
					var damageTypesJson = new JsonArray();
					
					try {
						lookupProvider.get().lookup(Registries.DAMAGE_TYPE).ifPresent((lookup) -> lookup.listElements().sorted(Comparator.comparing(Holder::getRegisteredName)).forEach((damageType) -> damageTypesJson.add(damageType.getRegisteredName())));
					} catch (InterruptedException | ExecutionException e) {
						throw new RuntimeException(e);
					}
					
					list.add(DataProvider.saveStable(cachedOutput, damageTypesJson, path.resolve("damage_types.json")));
					return CompletableFuture.allOf(list.toArray(CompletableFuture[]::new));
				}
				
				@Override
				public String getName() {
					return "stuff";
				}
			}
		);
		
		Runtime.getRuntime().addShutdownHook(new Thread(() -> {
			try {
				FileUtils.forceDelete(new File(output.getOutputFolder().toFile(), ".cache"));
			} catch (IOException e) {
				throw new RuntimeException(e);
			}
		}));
	}
}